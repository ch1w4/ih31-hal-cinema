from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import json
import base64

app = Flask(__name__)
app.secret_key = "super_secret_random_key_12345"  # セッションの秘密鍵(Githubのsecretsに保存)

# CORS設定（Next.jsからのリクエストを許可）
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])

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
    "https://www.googleapis.com/auth/youtube.readonly"
]

@app.route("/")
def index():
    return jsonify({"message": "Google Login Test API"})

@app.route("/login")
def login():
    """Google OAuth認可リクエストへリダイレクト"""
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent"
    }
    url = AUTH_URL + "?" + urllib.parse.urlencode(params)
    return redirect(url)

@app.route("/auth/callback")
def callback():
    """Google OAuth コールバック処理"""
    code = request.args.get("code")
    
    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    # トークン取得
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    token_res = requests.post(TOKEN_URL, data=data)
    token_json = token_res.json()

    if "error" in token_json:
        return jsonify({"error": token_json.get("error")}), 400

    # アクセストークンをセッションに保存
    access_token = token_json.get("access_token")
    session["access_token"] = access_token

    # ユーザー情報を取得してセッションに保存
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo_res = requests.get(USERINFO_URL, headers=headers)
    userinfo = userinfo_res.json()

    session["user_info"] = userinfo

    # ユーザー情報をBase64エンコード
    user_encoded = base64.b64encode(json.dumps(userinfo).encode()).decode()

    # フロントエンドにリダイレクト（トークンとユーザー情報をクエリパラメータで渡す）
    return redirect(f"http://localhost:3000/auth/success?token={access_token}&user={user_encoded}")

@app.route("/auth/user", methods=["GET"])
def get_user():
    """セッションからユーザー情報を取得"""
    if "user_info" not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    return jsonify(session.get("user_info"))

@app.route("/auth/logout", methods=["POST"])
def logout():
    """ログアウト処理"""
    session.clear()
    return jsonify({"message": "Logged out successfully"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
