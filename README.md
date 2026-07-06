# HAL CINEMA

映画館向けWebアプリケーション「HAL CINEMA」のリポジトリです。

> **現在のステータス: 開発中**
> UI・ページ遷移・Googleログイン・AI映画推薦・PostgreSQL DB連携を実装済み。決済などの一部機能は未実装。

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
| PostgreSQL 16 | メインDB（映画・キャンペーン・予約・チケット等） |
| SQLAlchemy 2.x | ORM |
| Alembic | DBマイグレーション |
| Google OAuth 2.0 | 認証・YouTubeデータ取得 |
| Google Colab + Ollama (qwen2.5:3b) | AI映画推薦生成 |
| ngrok | Colab のAPIをローカルに公開 |

### 今後導入予定
| 技術 | 用途 |
|------|------|
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
│   │   ├── layout.tsx
│   │   ├── now-showing/            # 上映中映画一覧
│   │   ├── coming-soon/            # 上映予定一覧・詳細
│   │   ├── campaign/               # キャンペーン・ニュース一覧・詳細
│   │   ├── movies/[id]/            # 映画詳細（チケット購入ボタン付き）
│   │   ├── tickets/                # チケット購入（7ステップウィザード・座席マップ）
│   │   ├── login/                  # ログイン
│   │   ├── register/               # 新規会員登録（Googleログイン対応）
│   │   └── auth/success/           # Google OAuth コールバック・AI推薦生成
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSlider.tsx
│   │   └── MovieCard.tsx
│   └── lib/
│       ├── api.ts                  # バックエンドAPIクライアント（全fetch関数）
│       └── mockData.ts             # 型定義のみ（Movie・Campaign・ScheduleDay 等）
├── backend/                        # Flask バックエンド
│   ├── main.py                     # 全エンドポイント（OAuth・AI推薦・REST API）
│   ├── models.py                   # SQLAlchemy ORM モデル（19テーブル）
│   ├── database.py                 # DB接続・セッション管理
│   ├── db/
│   │   ├── schema.sql              # PostgreSQL DDL（19テーブル＋インデックス）
│   │   ├── seed.sql                # 初期データ（券種・スクリーン・座席・ジャンル）
│   │   └── movies_seed.sql         # 映画・キャンペーン・上映スケジュール初期データ
│   ├── migrations/                 # Alembic マイグレーション
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Modelfile                   # Ollama カスタムモデル定義（phi3:mini ベース）
│   └── install.md                  # バックエンドセットアップ手順
├── CLAUDE.md
└── README.md
```

---

## ページ一覧

| URL | ページ名 | データソース |
|-----|---------|------------|
| `/` | ホーム | `GET /api/movies` |
| `/now-showing` | 上映中 | `GET /api/movies` |
| `/coming-soon` | 上映予定 | `GET /api/movies/coming-soon` |
| `/coming-soon/[id]` | 上映予定詳細 | `GET /api/movies/<id>` |
| `/campaign` | キャンペーン/ニュース | `GET /api/campaigns` |
| `/campaign/[id]` | キャンペーン詳細 | `GET /api/campaigns/<id>` |
| `/movies/[id]` | 映画詳細 | `GET /api/movies/<id>` |
| `/tickets` | チケット購入 | `GET /api/movies` + `GET /api/showings/<id>` |
| `/login` | ログイン | Google OAuth |
| `/register` | 新規登録 | Google OAuth |
| `/auth/success` | OAuth完了 | `POST /recommend/movies` |

---

## DBスキーマ（19テーブル）

```
movies          上映映画
genres          ジャンル
movie_genres    映画×ジャンル（多対多）
cast_members    キャスト
movie_casts     映画×キャスト（多対多）
screens         スクリーン（大・中・小）
seats           座席（行・列）
showings        上映スケジュール
ticket_types    券種（一般・学生・シニア・小学生以下）
members         会員
likes           AIスコア（会員×映画）
bookings        予約
booking_seats   予約座席（1行=1席）
payments        支払い
tickets         チケット（QRトークン）
coupons         クーポン
point_transactions ポイント履歴
notifications   通知
campaigns       キャンペーン・お知らせ
```

---

## AI映画推薦フロー

```
ユーザー (ブラウザ)       Flask (localhost:5000)        Google Colab (ngrok)
       │                          │                              │
       │── Googleログイン ──────► │                              │
       │                          │── DB から全映画取得           │
       │                          │── YouTube いいね・登録取得    │
       │                          │── POST /recommend ─────────► │
       │                          │   (user_history, movie_list) │── Ollama(qwen2.5:3b) で推薦生成
       │                          │◄─ { recommended_movie_id,    │
       │                          │     reason } ───────────────  │
       │◄── /auth/success ──────  │                              │
       │  (localStorage に保存)   │                              │
```

localStorage に保存されるキー:
- `authToken` — アクセストークン
- `userInfo` — Googleアカウント情報 `{ name, email, picture }`
- `recommendedMovies` — AI推薦映画リスト `[{ id, score, why }, ...]`

---

## 起動手順

### 毎回の起動順序

**① PostgreSQL を起動・接続確認**（初回はDB作成 → 下記「初回セットアップ」参照）

**② Google Colab を実行する**

ノートブックの全セルを実行し、最後に表示される URL をコピーする。
```
✅ APIサーバー起動成功！
🔗 送信先URL: https://xxxx-xxxx.ngrok-free.dev/recommend
```

**③ Flask バックエンドを起動する**
```powershell
cd backend
venv\Scripts\activate
python main.py
```

**④ Colab の URL を Flask に登録する**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/set-colab-url" -Method POST -ContentType "application/json" -Body '{"url": "https://xxxx-xxxx.ngrok-free.dev"}'
```

**⑤ フロントエンドを起動する**
```powershell
cd frontend
npm run dev
```

**⑥ ブラウザで `http://localhost:3000` を開いてGoogleログイン**

> Colab を再起動したら URL が変わるので ②④ だけやり直す。

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
pip install -r requirements.txt
```

**PostgreSQL DB 作成・初期データ投入**
```powershell
# DB作成（PostgreSQL インストール済みの前提）
psql -U postgres -c "CREATE DATABASE halcinema;"

# スキーマ（テーブル定義）適用
psql -U postgres -d halcinema -f backend/db/schema.sql

# 初期データ（スクリーン・座席・券種・ジャンル）
psql -U postgres -d halcinema -f backend/db/seed.sql

# 映画・キャンペーン・上映スケジュール投入
psql -U postgres -d halcinema -f backend/db/movies_seed.sql
```

> DB接続先を変更する場合は環境変数 `DATABASE_URL` を設定する。
> デフォルト: `postgresql://postgres:postgres@localhost:5432/halcinema`

**Colab の事前設定**

Colab の 🔑 Secrets に以下を登録する:
| 名前 | 値 |
|------|----|
| `NGROK_TOKEN` | [ngrok ダッシュボード](https://dashboard.ngrok.com/get-started/your-authtoken) で取得 |
| `HF_TOKEN` | Hugging Face アクセストークン |

---

## Flask API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/movies` | 上映中の映画一覧 |
| GET | `/api/movies/coming-soon` | 上映予定映画一覧 |
| GET | `/api/movies/all` | 全映画（AI推薦用） |
| GET | `/api/movies/<id>` | 映画詳細 |
| GET | `/api/showings/<movie_id>` | 上映スケジュール（日付・スクリーン別） |
| GET | `/api/campaigns` | キャンペーン一覧 |
| GET | `/api/campaigns/<id>` | キャンペーン詳細 |
| GET | `/login` | Google OAuth ログイン開始 |
| GET | `/auth/callback` | Google OAuth コールバック |
| POST | `/auth/logout` | ログアウト |
| POST | `/recommend/movies` | AI映画推薦（Colab連携） |
| POST | `/set-colab-url` | Colab の ngrok URL を更新 |

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
- [x] AI映画推薦（Google Colab + Ollama連携）
- [x] ログイン中はログイン/登録ボタンを非表示
- [x] ログアウト時に推薦データをクリア
- [x] PostgreSQL DB設計（19テーブル）
- [x] SQLAlchemy ORM モデル・Alembic マイグレーション
- [x] 映画・キャンペーン・スケジュールデータのDB管理
- [x] フロントエンドのデータソースをDB（Flask API）に移行

## 今後の実装予定

- [ ] JWT認証の完全実装（メール/パスワード登録・ログイン）
- [ ] 座席リアルタイムロック（Redis）
- [ ] Stripe 決済連携
- [ ] QRコードチケット生成・SendGridメール送信
- [ ] 管理者ダッシュボード
- [ ] ポイント・クーポン機能
