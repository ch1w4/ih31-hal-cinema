from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import json
import base64
import random

app = Flask(__name__)
app.secret_key = "super_secret_random_key_12345"

# DB初期化（PostgreSQL接続が通っていればテーブルを自動作成）
try:
    from database import init_db
    init_db()
except Exception as _db_err:
    print(f"[db] 初期化スキップ（PostgreSQL未接続の可能性）: {_db_err}")

# CORS設定（Next.jsからのリクエストを許可）
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:3000"]}},
    supports_credentials=True,
)

# Google OAuth 設定
CLIENT_ID = "757540546817-41rbdtbel91le8956kri1nqpno7qmqq0.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:5000/auth/callback"

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/youtube.readonly",
]


@app.route("/")
def index():
    return jsonify({"message": "Google Login Test API"})


@app.route("/login")
def login():
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }
    url = AUTH_URL + "?" + urllib.parse.urlencode(params)
    return redirect(url)


@app.route("/auth/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    token_res = requests.post(TOKEN_URL, data=data)
    token_json = token_res.json()

    if "error" in token_json:
        return jsonify({"error": token_json.get("error")}), 400

    access_token = token_json.get("access_token")
    session["access_token"] = access_token

    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo_res = requests.get(USERINFO_URL, headers=headers)
    userinfo = userinfo_res.json()
    session["user_info"] = userinfo

    user_encoded = base64.b64encode(json.dumps(userinfo).encode()).decode()

    return redirect(
        f"http://localhost:3000/auth/success?token={access_token}&user={user_encoded}"
    )


@app.route("/auth/user", methods=["GET"])
def get_user():
    if "user_info" not in session:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify(session.get("user_info"))


@app.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


# ============================================
# YouTubeのいいね動画
# ============================================
@app.route("/youtube/likes")
def youtube_likes():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,contentDetails",
        "myRating": "like",
        "maxResults": 50,
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    res = requests.get(url, params=params, headers=headers)
    return jsonify(res.json())


# ============================================
# YouTubeのチャンネル登録
# ============================================
@app.route("/youtube/subscriptions")
def youtube_subscriptions():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401

    url = "https://www.googleapis.com/youtube/v3/subscriptions"
    params = {
        "part": "snippet",
        "mine": "true",
        "maxResults": 50,
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    res = requests.get(url, params=params, headers=headers)
    return jsonify(res.json())


# ==================================================
# Colab の ngrok URL（Colab 起動後に /set-colab-url で更新する）
# ==================================================
COLAB_URL = ""


@app.route("/set-colab-url", methods=["POST"])
def set_colab_url():
    global COLAB_URL
    body = request.json or {}
    url = body.get("url", "").rstrip("/")
    if not url:
        return jsonify({"error": "url が空です"}), 400
    COLAB_URL = url
    print(f"[colab] URL を更新: {COLAB_URL}")
    return jsonify({"message": f"Colab URL を設定しました: {COLAB_URL}"})


@app.route("/colab-url", methods=["GET"])
def get_colab_url():
    return jsonify({"url": COLAB_URL or None})


# ==================================================
# 映画推薦エンドポイント（フロントからJSONを受け取る）
# ==================================================
@app.route("/recommend/movies", methods=["POST"])
def recommend_movies():
    try:
        if "access_token" not in session:
            return jsonify({"error": "Not authenticated"}), 401

        if not COLAB_URL:
            return jsonify({"error": "Colab が起動していません。Colab を実行してから /set-colab-url で URL を登録してください。"}), 503

        # 映画リストを DB から取得（フロントエンドからの body は不要）
        try:
            from models import Movie as MovieModel
            from datetime import date as _date
            db = _get_db()
            all_rows = db.query(MovieModel).order_by(MovieModel.ranking).all()
            db.close()
            movies_list = [_movie_to_dict(m) for m in all_rows if m.release_date and m.release_date <= _date.today()]
            coming = [_movie_to_dict(m) for m in all_rows if m.release_date and m.release_date > _date.today()]
        except Exception:
            body = request.json or {}
            movies_list = body.get("movies", [])
            coming = body.get("comingSoonMovies", [])

        # YouTubeデータを直接 Google API から取得
        access_token = session["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            likes = requests.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={"part": "snippet", "myRating": "like", "maxResults": 50},
                headers=headers, timeout=5
            ).json()
        except Exception:
            likes = {"items": []}
        try:
            subs = requests.get(
                "https://www.googleapis.com/youtube/v3/subscriptions",
                params={"part": "snippet", "mine": "true", "maxResults": 50},
                headers=headers, timeout=5
            ).json()
        except Exception:
            subs = {"items": []}

        # Colab に渡す user_history
        user_history = {
            "liked_videos": [v.get("snippet", {}).get("title", "") for v in likes.get("items", [])][:20],
            "subscriptions": [v.get("snippet", {}).get("title", "") for v in subs.get("items", [])][:20],
        }

        # 候補映画リスト（最大15本）
        all_movies = {m["id"]: m for m in movies_list + coming}
        movie_list = [
            {"id": m["id"], "title": m.get("title", ""), "genre": m.get("genre", [])}
            for m in (movies_list + coming)[:15]
        ]

        print(f"[colab] 推薦リクエスト送信 - 候補: {len(movie_list)}本")

        # Colab の /recommend を呼ぶ
        colab_res = requests.post(
            f"{COLAB_URL}/recommend",
            json={"user_history": user_history, "movie_list": movie_list},
            timeout=180
        )
        colab_json = colab_res.json()
        print(f"[colab] レスポンス: {colab_json}")

        if "error" in colab_json:
            return jsonify({"error": colab_json["error"]}), 500

        rec_id = str(colab_json.get("recommended_movie_id", ""))
        reason = colab_json.get("reason", "")

        # 推薦された映画の詳細情報を付与
        recommended = []
        if rec_id in all_movies:
            m = all_movies[rec_id]
            recommended.append({
                "id": m.get("id"),
                "title": m.get("title"),
                "posterColor": m.get("posterColor", "#666"),
                "poster": m.get("poster", ""),
                "score": 1.0,
                "why": reason,
            })

        return jsonify({
            "reason": reason,
            "recommended_movies": recommended,
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "Colab への接続がタイムアウトしました（180秒）"}), 504
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ============================================
# REST API（DB連携）
# ============================================
def _get_db():
    from database import SessionLocal
    return SessionLocal()


def _movie_to_dict(m):
    """SQLAlchemy Movie → フロントエンドの Movie 型"""
    genres = [mg.genre.name for mg in m.genres]
    casts  = [mc.cast_member.name for mc in m.casts]
    return {
        "id":          str(m.movie_id),
        "title":       m.title,
        "titleEn":     m.title_en or "",
        "genre":       genres,
        "releaseDate": m.release_date.isoformat() if m.release_date else "",
        "endDate":     m.end_date.isoformat() if m.end_date else "",
        "duration":    m.duration or 0,
        "rating":      m.rating or "G",
        "synopsis":    m.synopsis or "",
        "cast":        casts,
        "director":    m.director or "",
        "posterColor": m.poster_color or "#1a1a1a",
        "poster":      m.poster_path or "",
        "ranking":     m.ranking,
    }


@app.route("/api/movies")
def api_movies():
    """上映中の映画一覧（end_date >= 今日 または NULL）"""
    try:
        from models import Movie
        from datetime import date
        db = _get_db()
        try:
            today = date.today()
            rows = (db.query(Movie)
                    .filter((Movie.end_date >= today) | (Movie.end_date == None))
                    .filter(Movie.release_date <= today)
                    .order_by(Movie.ranking)
                    .all())
            return jsonify([_movie_to_dict(m) for m in rows])
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/movies/coming-soon")
def api_movies_coming_soon():
    """上映予定（release_date > 今日）"""
    try:
        from models import Movie
        from datetime import date
        db = _get_db()
        try:
            today = date.today()
            rows = (db.query(Movie)
                    .filter(Movie.release_date > today)
                    .order_by(Movie.release_date)
                    .all())
            return jsonify([_movie_to_dict(m) for m in rows])
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/movies/all")
def api_movies_all():
    """全映画（AI推薦用）"""
    try:
        from models import Movie
        db = _get_db()
        try:
            rows = db.query(Movie).order_by(Movie.ranking, Movie.release_date).all()
            return jsonify([_movie_to_dict(m) for m in rows])
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/movies/<int:movie_id>")
def api_movie_detail(movie_id):
    """映画詳細"""
    try:
        from models import Movie
        db = _get_db()
        try:
            m = db.query(Movie).filter(Movie.movie_id == movie_id).first()
            if not m:
                return jsonify({"error": "Not found"}), 404
            return jsonify(_movie_to_dict(m))
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/showings/<int:movie_id>")
def api_showings(movie_id):
    """
    映画IDに対する上映スケジュール（チケット購入ページ用）
    レスポンス形式: ScheduleDay[] = [{ date: "MM/DD", slots: [{ screen, times }] }]
    """
    try:
        from models import Showing, Screen
        from datetime import date
        db = _get_db()
        try:
            today = date.today()
            rows = (db.query(Showing)
                    .filter(Showing.movie_id == movie_id)
                    .filter(Showing.show_date >= today)
                    .order_by(Showing.show_date, Showing.start_time)
                    .all())

            # { date_str: { screen_name: [time_str, ...] } }
            grouped: dict = {}
            for s in rows:
                date_str = f"{s.show_date.month}/{s.show_date.day:02d}"
                screen_name = s.screen.name
                time_str = s.start_time.strftime("%H:%M")
                grouped.setdefault(date_str, {}).setdefault(screen_name, []).append(time_str)

            schedule = [
                {
                    "date": d,
                    "slots": [{"screen": scr, "times": times}
                              for scr, times in screens.items()]
                }
                for d, screens in grouped.items()
            ]
            return jsonify(schedule)
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/campaigns")
def api_campaigns():
    """キャンペーン一覧"""
    try:
        from models import Campaign
        db = _get_db()
        try:
            rows = db.query(Campaign).order_by(Campaign.campaign_id).all()
            return jsonify([{
                "id":          str(c.campaign_id),
                "title":       c.title,
                "subtitle":    c.subtitle or "",
                "description": c.description or "",
                "body":        c.body or "",
                "period":      c.period or "",
                "category":    c.category,
                "imageSrc":    c.image_path or "",
                "accentColor": c.accent_color or "#555",
            } for c in rows])
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/campaigns/<int:campaign_id>")
def api_campaign_detail(campaign_id):
    """キャンペーン詳細"""
    try:
        from models import Campaign
        db = _get_db()
        try:
            c = db.query(Campaign).filter(Campaign.campaign_id == campaign_id).first()
            if not c:
                return jsonify({"error": "Not found"}), 404
            return jsonify({
                "id":          str(c.campaign_id),
                "title":       c.title,
                "subtitle":    c.subtitle or "",
                "description": c.description or "",
                "body":        c.body or "",
                "period":      c.period or "",
                "category":    c.category,
                "imageSrc":    c.image_path or "",
                "accentColor": c.accent_color or "#555",
            })
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Flaskアプリの起動（最後に1回だけ）
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
