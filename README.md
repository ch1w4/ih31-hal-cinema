# HAL CINEMA

映画館向けWebアプリケーション「HAL CINEMA」のリポジトリです。

> **現在のステータス: モック制作中**
> UI・ページ遷移・Googleログイン・AI映画推薦を実装済み。決済などの一部バックエンド連携は未実装。

---

## 技術スタック

### フロントエンド（`frontend/`）
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16.x (App Router) | フレームワーク |
| TypeScript | 5.x | 型安全 |
| Tailwind CSS | 4.x | スタイリング |

### バックエンド（`backend/`）
| 技術 | 用途 |
|------|------|
| Flask (Python 3.12) | REST API サーバー |
| Google OAuth 2.0 | 認証・YouTubeデータ取得 |
| Google Colab + Ollama (qwen2.5:3b) | AI映画推薦生成 |
| ngrok | Colab のAPIをローカルに公開 |

### 今後導入予定
| 技術 | 用途 |
|------|------|
| PostgreSQL | メインDB |
| Redis | 座席リアルタイムロック・セッション |
| Stripe | 決済処理 |
| SendGrid | チケットメール・QRコード送信 |

---

## ディレクトリ構成

```
ih31-hal-cinema/
├── frontend/                       # Next.js フロントエンド
│   ├── app/
│   │   ├── page.tsx                # ホーム（スライダー・ランキング/AI推薦・上映中グリッド）
│   │   ├── layout.tsx              # ルートレイアウト
│   │   ├── now-showing/            # 上映中映画一覧
│   │   ├── coming-soon/            # 上映予定一覧・詳細
│   │   ├── campaign/               # キャンペーン・ニュース一覧・詳細
│   │   ├── movies/[id]/            # 映画詳細（チケット購入ボタン付き）
│   │   ├── tickets/                # チケット購入（7ステップウィザード・座席マップ）
│   │   ├── login/                  # ログイン
│   │   ├── register/               # 新規会員登録（Googleログイン対応）
│   │   └── auth/success/           # Google OAuth コールバック・AI推薦生成
│   ├── components/
│   │   ├── Header.tsx              # ナビゲーション・ユーザーメニュー
│   │   ├── HeroSlider.tsx          # トップキャンペーンバナースライダー
│   │   └── MovieCard.tsx           # 映画サムネイルカード
│   ├── lib/
│   │   └── mockData.ts             # モックデータ（映画・スケジュール・キャンペーン）
│   └── public/
│       ├── halcinemalogo.png
│       └── images/hero/
├── backend/                        # Flask バックエンド
│   ├── main.py                     # Google OAuth + AI推薦エンドポイント
│   ├── Modelfile                   # Ollama カスタムモデル定義（phi3:mini ベース）
│   └── install.md                  # バックエンドセットアップ手順
├── CLAUDE.md
└── README.md
```

---

## ページ一覧

| URL | ページ名 | 概要 |
|-----|---------|------|
| `/` | ホーム | バナー・映画ランキング（ログイン時はAI推薦）・上映中グリッド |
| `/now-showing` | 上映中 | 全上映映画一覧 |
| `/coming-soon` | 上映予定 | 公開予定映画の月別一覧 |
| `/coming-soon/[id]` | 上映予定詳細 | あらすじ・キャスト・販売開始日 |
| `/campaign` | キャンペーン/ニュース | キャンペーン・割引情報一覧 |
| `/campaign/[id]` | キャンペーン詳細 | キャンペーン本文・期間 |
| `/movies/[id]` | 映画詳細 | あらすじ・キャスト・チケット購入ボタン |
| `/tickets` | チケット購入 | 映画選択→時間帯→座席→種別→情報入力→確認→完了（7ステップ） |
| `/login` | ログイン | Googleログイン（OAuth） |
| `/register` | 新規登録 | 会員登録（Googleログイン対応） |
| `/auth/success` | OAuth完了 | ログイン後コールバック・AI推薦生成・リダイレクト |

---

## AI映画推薦フロー

```
ユーザー (ブラウザ)       Flask (localhost:5000)        Google Colab (ngrok)
       │                          │                              │
       │── Googleログイン ──────► │                              │
       │                          │── YouTube いいね・登録取得    │
       │                          │── POST /recommend ─────────► │
       │                          │   (user_history, movie_list) │── Ollama(qwen2.5:3b) で推薦生成
       │                          │◄─ { recommended_movie_id,    │
       │                          │     reason } ───────────────  │
       │◄── /auth/success ──────  │                              │
       │  (localStorage に保存)   │                              │
       │── ホームページへ         │                              │
```

localStorage に保存されるキー:
- `authToken` — アクセストークン
- `userInfo` — Googleアカウント情報 `{ name, email, picture }`
- `recommendedMovies` — AI推薦映画リスト `[{ id, score, why }, ...]`

---

## 起動手順

### 毎回の起動順序

**① Google Colab を実行する**

ノートブックの全セルを実行し、最後に表示される URL をコピーする。
```
✅ APIサーバー起動成功！
🔗 送信先URL: https://xxxx-xxxx.ngrok-free.dev/recommend
```

**② Flask バックエンドを起動する**
```powershell
cd backend
venv\Scripts\activate
python main.py
```

**③ Colab の URL を Flask に登録する**（`/recommend` の前まで）
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/set-colab-url" -Method POST -ContentType "application/json" -Body '{"url": "https://xxxx-xxxx.ngrok-free.dev"}'
```

**④ フロントエンドを起動する**
```powershell
cd frontend
npm run dev
```

**⑤ ブラウザで `http://localhost:3000` を開いてGoogleログイン**

> Colab を再起動したら URL が変わるので ①③ だけやり直す。

---

### 初回セットアップ

**フロントエンド**
```powershell
cd frontend
npm install
```

**バックエンド**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask requests flask-cors
```

**Colab の事前設定**

Colab の 🔑 Secrets に以下を登録する:
| 名前 | 値 |
|------|----|
| `NGROK_TOKEN` | [ngrok ダッシュボード](https://dashboard.ngrok.com/get-started/your-authtoken) で取得 |
| `HF_TOKEN` | Hugging Face アクセストークン |

---

## スクリーン構成（チケット購入 座席マップ）

| スクリーン | 総席数 | 構成 | 出入り口 |
|-----------|--------|------|---------|
| 大スクリーン1 | 200席 | A〜C列(各16席) + D〜I列(各13席、左2席+通路+右11席) | 右側 |
| 中スクリーン1 | 120席 | A〜H列(各15席) | 左側 |
| 小スクリーン1 | 70席 | A〜G列(各10席) | 右側 |

---

## 実装済み機能

- [x] サイト全体のデザイン・ダークテーマ
- [x] ページ間のルーティング・遷移
- [x] キャンペーンバナー（ヒーロースライダー）
- [x] 映画ランキング（ログアウト時）/ AI推薦（ログイン時）の切り替え
- [x] 映画一覧・詳細表示（上映中・上映予定）
- [x] 映画詳細からチケット購入ページへの遷移
- [x] チケット購入フロー（7ステップUI・3種スクリーン対応座席マップ）
- [x] Google OAuth ログイン・ログアウト
- [x] Googleログインボタン（登録・ログインページ）
- [x] AI映画推薦（Google Colab + Ollama連携）
- [x] ログイン中はログイン/登録ボタンを非表示
- [x] ログアウト時に推薦データをクリア

## 今後の実装予定

- [ ] PostgreSQL スキーマ設計・マイグレーション
- [ ] JWT認証の完全実装
- [ ] 座席リアルタイムロック（Redis）
- [ ] Stripe 決済連携
- [ ] QRコードチケット生成・SendGridメール送信
- [ ] 管理者ダッシュボード
- [ ] メール/パスワード登録・ログイン機能
