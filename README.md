# HAL CINEMA

映画館向けWebアプリケーション「HAL CINEMA」のフロントエンドリポジトリです。

> **現在のステータス: モック制作中**
> ページ遷移・UIデザイン・AI映画推薦（FastAPI連携）を実装済み。決済などの一部バックエンド連携は未実装。

---

## 技術スタック

### フロントエンド（実装済み）
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16.x (App Router) | フレームワーク |
| TypeScript | 5.x | 型安全 |
| Tailwind CSS | 4.x | スタイリング |

### バックエンド（AIsystem/ ディレクトリ）
| 技術 | 用途 |
|------|------|
| FastAPI (Python 3.12) | REST API |
| Google OAuth 2.0 | 認証 |
| Claude API (Anthropic) | AI映画推薦生成 |

### フロントエンド（今後導入予定）
- **React Query** — API通信・キャッシュ管理
- **Zustand** — UI状態管理（座席選択など）

### バックエンド（今後構築予定）
| 技術 | 用途 |
|------|------|
| SQLAlchemy 2 + Alembic | ORM・マイグレーション |
| PostgreSQL 16 | メインDB |
| Redis 7 | 座席ロック・セッション |

### 外部サービス（今後連携予定）
- **Stripe** — 決済処理
- **SendGrid** — メール送信・QRコードチケット添付

---

## ディレクトリ構成

```
hal-cinema/
├── app/                        # Next.js App Router
│   ├── page.tsx                # ホーム（スライダー・ランキング・上映中グリッド）
│   ├── layout.tsx              # ルートレイアウト（HTML骨格・メタデータ）
│   ├── now-showing/            # 上映中映画一覧（AI推薦サイドパネル付き）
│   ├── coming-soon/            # 上映予定一覧
│   │   └── [id]/               # 上映予定映画詳細
│   ├── campaign/               # キャンペーン・ニュース一覧
│   │   └── [id]/               # キャンペーン詳細
│   ├── tickets/                # チケット購入（7ステップウィザード・座席マップ）
│   ├── movies/[id]/            # 上映中映画詳細（スケジュール・予約パネル）
│   ├── login/                  # ログイン（Googleログイン）
│   ├── register/               # 新規会員登録（モックUI）
│   └── auth/success/           # Google OAuth コールバック処理
├── components/
│   ├── Header.tsx              # ナビゲーション（ロゴ・メニュー・ユーザーメニュー）
│   ├── HeroSlider.tsx          # トップキャンペーンバナースライダー
│   └── MovieCard.tsx           # 映画サムネイルカード
├── lib/
│   └── mockData.ts             # モックデータ（映画・上映予定・スケジュール・キャンペーン）
├── AIsystem/                   # FastAPI バックエンド
│   └── main.py                 # Google OAuth + AI映画推薦エンドポイント
└── public/
    ├── halcinemalogo.png        # ロゴ画像
    └── images/hero/             # ヒーロースライダー用画像
```

---

## ページ一覧

| URL | ページ名 | 概要 |
|-----|---------|------|
| `/` | ホーム | キャンペーンバナー・映画ランキング（AI推薦対応）・上映中グリッド |
| `/now-showing` | 上映中 | 全上映映画一覧（AI推薦サイドパネル・TOP4グリッド付き） |
| `/coming-soon` | 上映予定 | 公開予定映画の月別グループ一覧 |
| `/coming-soon/[id]` | 上映予定詳細 | あらすじ・キャスト・チケット販売開始日のお知らせ |
| `/campaign` | キャンペーン/ニュース | キャンペーン・割引情報一覧 |
| `/campaign/[id]` | キャンペーン詳細 | キャンペーン本文・期間表示 |
| `/movies/[id]` | 映画詳細 | あらすじ・キャスト・上映スケジュール・日付別タイムスロット・予約パネル |
| `/tickets` | チケット購入 | 映画選択→座席選択→チケット種別→お客様情報→購入確認→完了（7ステップ） |
| `/login` | ログイン | Googleログイン（OAuth）・メール/パスワードフォーム（モック） |
| `/register` | 新規登録 | 会員登録フォーム（モックUI） |
| `/auth/success` | OAuth完了 | Googleログイン後のコールバック処理・AI推薦生成・リダイレクト |

---

## スクリーン構成（チケット購入 座席マップ）

| スクリーン | 総席数 | 構成 | 出入り口 |
|-----------|--------|------|---------|
| 大スクリーン1 | 200席 | A〜C列(各16席) + D〜I列(各13席、左2席+通路+右11席) | 右側 |
| 中スクリーン1 | 120席 | A〜H列(各15席) | 左側 |
| 小スクリーン1 | 70席 | A〜G列(各10席) | 右側 |

---

## AI映画推薦フロー

```
ユーザー (ブラウザ)          FastAPI (localhost:5000)      Claude API (Anthropic)
       │                            │                              │
       │── GET /login ──────────── │                              │
       │                            │── Google OAuth リダイレクト   │
       │── Google 認証完了 ─────── │                              │
       │                            │── POST /recommend/movies ──► │
       │                            │   (全映画リストをPOST)        │── AI推薦生成 ──►
       │                            │◄─ AI推薦JSON ──────────────  │
       │◄── /auth/success?token=... │                              │
       │ (localStorage に保存)      │                              │
       │── /now-showing にリダイレクト                             │
```

localStorage に保存されるキー:
- `authToken` — JWT認証トークン
- `userInfo` — Googleアカウント情報 `{ name, email, picture }`
- `recommendedMovies` — AI推薦映画リスト `[{ id, score, why }, ...]`

---

## 開発環境のセットアップ

### フロントエンド

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開くと確認できます。

```bash
# プロダクションビルド
npm run build

# ビルド結果の起動
npm start
```

### バックエンド（AIsystem/）

```bash
cd AIsystem
pip install -r requirements.txt

# 環境変数の設定（.env ファイルを作成）
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# ANTHROPIC_API_KEY=...
# SECRET_KEY=...

uvicorn main:app --reload --port 5000
```

---

## 実装済み機能（モック）

- [x] サイト全体のデザイン・ダークテーマ（高齢者対応の大きめフォント）
- [x] ページ間のルーティング・遷移
- [x] キャンペーンバナー（ヒーロースライダー、2スライド）
- [x] 映画ランキング（5列グリッド・AI推薦モード切替）
- [x] 映画一覧・詳細表示（上映中・上映予定の両方に詳細ページ）
- [x] 上映スケジュール（地域・劇場・日付タブ切替・タイムスロット選択）
- [x] チケット購入フロー（7ステップUI・3種スクリーン対応座席マップ）
- [x] 購入完了画面（予約番号・予約内容サマリー）
- [x] Google OAuth ログイン（FastAPI連携）
- [x] AI映画推薦（ログイン後にClaude APIで生成、ホーム・上映中ページで表示）
- [x] ログイン・会員登録フォーム（Google OAuthのみ動作）

## 今後の実装予定

- [ ] PostgreSQL スキーマ設計・マイグレーション
- [ ] JWT認証の完全実装（トークン検証・更新）
- [ ] 座席リアルタイムロック（Redis）
- [ ] Stripe 決済連携
- [ ] QRコードチケット生成・SendGridメール送信
- [ ] 管理者ダッシュボード
- [ ] スタッフ向けQRコード読み取り入場管理
- [ ] ポイント管理・割引機能
- [ ] メール/パスワード登録・ログイン機能
