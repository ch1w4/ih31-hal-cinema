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
# ollamaのgemmaにプロンプトを投げる
# ==================================================
def ask_gemma(prompt: str) -> str:
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "gemma3:4b",
        "prompt": prompt,
        "stream": False,
    }
    res = requests.post(url, json=payload)
    print("Gemma raw response:", res.json())
    return res.json().get("response", "")


# ====================================================================
# テスト用エンドポイント
# ====================================================================
@app.route("/test/gemma")
def test_gemma():
    test_prompt = "こんにちは。あなたは動作していますか？短く答えてください。"
    response = ask_gemma(test_prompt)
    return jsonify({"gemma_response": response})


# ==================================================
# 映画推薦エンドポイント（フロントからJSONを受け取る）
# ==================================================
@app.route("/recommend/movies", methods=["POST"])
def recommend_movies():
    try:
        if "access_token" not in session:
            return jsonify({"error": "Not authenticated"}), 401

        body = request.json or {}
        movies = body.get("movies", [])
        coming = body.get("comingSoonMovies", [])

        # YouTubeデータ取得
        likes = requests.get("http://localhost:5000/youtube/likes").json()
        subs = requests.get("http://localhost:5000/youtube/subscriptions").json()

        # プロンプト生成（ここで likes / subs / movies / coming を全部埋め込む）
        prompt_text = f"""
あなたは映画推薦AIです。

【ユーザーのYouTubeデータ】
高評価動画:
{json.dumps(likes, ensure_ascii=False)}

登録チャンネル:
{json.dumps(subs, ensure_ascii=False)}

【映画館の上映作品】
{json.dumps(movies, ensure_ascii=False)}

【近日公開作品】
{json.dumps(coming, ensure_ascii=False)}

上記の情報からユーザーの嗜好を推定し、
各映画に対して「ユーザーとのマッチ度スコア（0〜100）」を付けてください。

出力形式は以下のJSON：

{
  "reason": "ユーザーの好みの分析",
  "recommendations": [
    {
      "id": "映画ID",
      "title": "映画タイトル",
      "score": 数値,
      "why": "選んだ理由"
    }
  ]
}
"""


        ai_response = ask_gemma(prompt_text)

        # フロントで中身を確認しやすいように、プロンプトも一緒に返す
        return jsonify(
            {
                "prompt": prompt_text,
                "ai_output": ai_response,
            }
        )
    except Exception as e:
        print("Error in /recommend/movies:", e)
        return jsonify({"error": str(e)}), 500


# Flaskアプリの起動（最後に1回だけ）
if __name__ == "__main__":
    app.run(port=5000, debug=True)
