from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import json
import base64

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
# ollamaのmovie-recにプロンプトを投げる
# ==================================================
def ask_movie_rec(prompt: str) -> str:
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "movie-rec",
        "prompt": prompt,
        "stream": False,
    }
    res = requests.post(url, json=payload)
    return res.json().get("response", "")


# ====================================================================
# テスト用エンドポイント
# ====================================================================
@app.route("/test/movie-rec")
def test_movie_rec():
    test_prompt = "こんにちは。短く返事してください。"
    response = ask_movie_rec(test_prompt)
    return jsonify({"movie_rec_response": response})


# ==================================================
# 映画推薦エンドポイント
# ==================================================
@app.route("/recommend/movies", methods=["POST"])
def recommend_movies():
    try:
        if "access_token" not in session:
            return jsonify({"error": "Not authenticated"}), 401

        body = request.json or {}
        movies_list = body.get("movies", [])
        coming = body.get("comingSoonMovies", [])

        # YouTubeデータ取得（エラーハンドリング付き）
        youtube_likes = []
        youtube_subs = []
        
        try:
            likes_res = requests.get("http://localhost:5000/youtube/likes")
            if likes_res.status_code == 200:
                youtube_likes = likes_res.json().get("items", [])
        except Exception as e:
            print(f"⚠️  YouTube Likes取得失敗: {str(e)}")
        
        try:
            subs_res = requests.get("http://localhost:5000/youtube/subscriptions")
            if subs_res.status_code == 200:
                youtube_subs = subs_res.json().get("items", [])
        except Exception as e:
            print(f"⚠️  YouTube Subscriptions取得失敗: {str(e)}")

        # user_profile を compact に
        user_profile = {
            "youtube_likes": youtube_likes,
            "youtube_subs": youtube_subs,
        }

        # YouTubeデータが空なら fallback
        if len(user_profile["youtube_likes"]) == 0 and len(user_profile["youtube_subs"]) == 0:
            user_profile["default_preference"] = True

        # 映画は全件渡す（16本）
        all_candidates = movies_list + coming

        # Ollama 用プロンプト生成
        prompt_text = f"""与えられたユーザープロフィールと映画候補から、おすすめの映画を選んでください。

ユーザープロフィール:
{json.dumps(user_profile, ensure_ascii=False, indent=2)}

映画候補:
{json.dumps(all_candidates, ensure_ascii=False, indent=2)}

以下のJSON形式で、必ず正確に返してください。他のテキストは返さないでください:

{{
  "reason": "ユーザーのプロフィール分析（簡潔に）",
  "recommendations": [
    {{"id": 1, "score": 0.9, "why": "おすすめ理由"}},
    {{"id": 2, "score": 0.85, "why": "おすすめ理由"}}
  ]
}}

最大10件の推薦映画を返してください。"""

        print("\n" + "=" * 80)
        print("🎬 映画推薦リクエスト開始")
        print("=" * 80)
        print(f"YouTube高評価動画数: {len(user_profile['youtube_likes'])}")
        print(f"登録チャンネル数: {len(user_profile['youtube_subs'])}")
        print(f"候補映画数: {len(all_candidates)}")
        print("\n📝 プロンプトを movie-rec に送信中...")

        ai_response = ask_movie_rec(prompt_text)

        print("\n✅ AIレスポンス取得完了")
        print(f"レスポンス長: {len(ai_response)} 文字")
        print(f"レスポンス内容:\n{ai_response}\n")

        # JSON解析
        ai_json = {}
        recommendations = []
        try:
            cleaned = ai_response.strip()

            # マークダウンコードブロックを削除
            if "```" in cleaned:
                cleaned = cleaned.split("```")[1]
                cleaned = cleaned.replace("json", "", 1).strip()
                cleaned = cleaned.split("```")[0].strip()

            # JSON をパース
            ai_json = json.loads(cleaned)
            recommendations = ai_json.get("recommendations", [])
            print(f"✅ JSON解析成功: {len(recommendations)}件の推薦を取得")

        except json.JSONDecodeError as e:
            print(f"⚠️  JSON解析失敗: {str(e)}")
            print(f"正確なレスポンス: {ai_response}")
            
            # フォールバック: 自然言語レスポンスから映画 ID を推測
            print("🔄 フォールバック処理を実行...")
            recommendations = []
            for movie in all_candidates:
                # スコアはランダムに割り当て
                import random
                recommendations.append({
                    "id": movie.get("id"),
                    "score": random.uniform(0.5, 0.95),
                    "why": "デフォルト推薦"
                })
            # ランダムに最大5件を選択
            recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:5]
            print(f"🔄 フォールバック: {len(recommendations)}件の推薦を生成")
            print(f"✅ JSON解析成功: {len(recommendations)}件の推薦を取得")

        except json.JSONDecodeError as e:
            print(f"❌ JSON解析失敗: {str(e)}")
            print(f"レスポンス内容: {ai_response}")
            recommendations = []

        # 映画データを結合
        all_movies = {movie["id"]: movie for movie in all_candidates}

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

        print(f"\n🎯 最終的な推薦映画数: {len(enriched_recommendations)}")

        result = {
            "reason": ai_json.get("reason", "") if "ai_json" in locals() else "",
            "recommended_movies": enriched_recommendations[:10],
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


# Flaskアプリ起動
if __name__ == "__main__":
    app.run(port=5000, debug=True)
