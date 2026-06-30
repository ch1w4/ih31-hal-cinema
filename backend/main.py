from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import json
import base64
import random

app = Flask(__name__)
app.secret_key = "super_secret_random_key_12345"

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


# Flaskアプリの起動（最後に1回だけ）
if __name__ == "__main__":
    app.run(port=5000, debug=True)
