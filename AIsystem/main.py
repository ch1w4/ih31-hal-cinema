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
        movies_list = body.get("movies", [])
        coming = body.get("comingSoonMovies", [])

        # YouTubeデータ取得
        likes = requests.get("http://localhost:5000/youtube/likes").json()
        subs = requests.get("http://localhost:5000/youtube/subscriptions").json()

        # プロンプト生成
        prompt_text = f"""
あなたは映画推薦AIです。

【ユーザーのYouTubeデータ】
高評価動画:
{json.dumps(likes, ensure_ascii=False)}

登録チャンネル:
{json.dumps(subs, ensure_ascii=False)}

【映画館の上映作品】
{json.dumps(movies_list, ensure_ascii=False)}

【近日公開作品】
{json.dumps(coming, ensure_ascii=False)}

上記の情報からユーザーの嗜好を推定し、
映画館のラインナップの中から最適な映画を推薦してください。

出力形式は以下のJSON：

{{
  "reason": "ユーザーの好みの分析",
  "recommendations": [
    {{
      "id": "映画ID",
      "title": "映画タイトル",
      "score": 数値,
      "why": "選んだ理由"
    }}
  ]
}}
"""

        print("\n" + "=" * 80)
        print("🎬 映画推薦リクエスト開始")
        print("=" * 80)
        print(f"YouTube高評価動画数: {len(likes.get('items', []))}")
        print(f"登録チャンネル数: {len(subs.get('items', []))}")
        print(f"対象映画数: {len(movies_list)}")
        print(f"近日公開映画数: {len(coming)}")
        print("\n📝 プロンプトをGemmaに送信中...")

        ai_response = ask_gemma(prompt_text)

        print("\n✅ AIレスポンス取得完了")
        print(f"レスポンス長: {len(ai_response)} 文字")
        print(f"レスポンス内容:\n{ai_response}\n")

        # AIレスポンスをJSON として解析
        try:
            # 複数行のJSON レスポンスをパース
            ai_json = json.loads(ai_response)
            recommendations = ai_json.get("recommendations", [])
            print(f"✅ JSON解析成功: {len(recommendations)}件の推薦を取得")
        except json.JSONDecodeError as e:
            # JSONパース失敗時はリコメンデーションを空にする
            print(f"❌ JSON解析失敗: {str(e)}")
            print(f"レスポンス内容: {ai_response}")
            recommendations = []

        # 映画データを全て結合
        all_movies = {movie["id"]: movie for movie in movies_list + coming}

        # レコメンデーションに映画の詳細情報を付与
        enriched_recommendations = []
        for rec in recommendations:
            movie_id = rec.get("id")
            if movie_id in all_movies:
                movie_data = all_movies[movie_id]
                enriched_recommendations.append(
                    {
                        "id": movie_data.get("id"),
                        "title": movie_data.get("title"),
                        "posterColor": movie_data.get("posterColor", "#666"),
                        "score": rec.get("score", 0),
                        "why": rec.get("why", ""),
                    }
                )
            else:
                print(f"⚠️  映画IDが見つかりません: {movie_id}")

        print(f"\n🎯 最終的な推薦映画数: {len(enriched_recommendations)}")
        for i, movie in enumerate(enriched_recommendations, 1):
            print(f"  {i}. {movie['title']} (スコア: {movie['score']}) - {movie['why']}")

        result = {
            "reason": ai_json.get("reason", "") if "ai_json" in locals() else "",
            "recommended_movies": enriched_recommendations[:10],  # Top 10 の推薦
        }
        print(f"\n✨ レスポンス送信: {len(result['recommended_movies'])}件の推薦を返却")
        print("=" * 80 + "\n")

        return jsonify(result)
    except Exception as e:
        print("=" * 80)
        print(f"❌ /recommend/movies エラー発生: {str(e)}")
        print("=" * 80)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Flaskアプリの起動（最後に1回だけ）
if __name__ == "__main__":
    app.run(port=5000, debug=True)
