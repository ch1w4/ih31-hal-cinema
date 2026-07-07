from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import json
import base64
import random
import string
import os
import re as _re

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

# ==================================================
# Ollama（Docker 内 LLM）設定
# OLLAMA_URL が設定されている場合は Colab より優先して使用する
# ==================================================
OLLAMA_URL   = os.getenv("OLLAMA_URL", "")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")


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
# Ollama 直接呼び出しヘルパー
# ==================================================
def _recommend_via_ollama(user_history: dict, movie_list: list, all_movies: dict):
    """Ollama に直接問い合わせて映画を推薦する。失敗時はランダム選択にフォールバック。"""
    system_prompt = (
        "あなたは映画推薦AIです。"
        "ユーザーのYouTube視聴履歴と映画候補リストを受け取り、最も合う映画を1本選んで推薦してください。"
        "必ず以下のJSON形式のみで返してください（他のテキストは絶対に含めないこと）:\n"
        '{"recommended_movie_id": "映画のID（数字）", "reason": "推薦理由を2〜3文で"}'
    )
    liked = user_history.get("liked_videos", [])
    subs  = user_history.get("subscriptions", [])
    prompt = (
        f"ユーザー情報:\n"
        f"- YouTubeいいね動画: {', '.join(liked[:10]) or 'なし'}\n"
        f"- チャンネル登録: {', '.join(subs[:10]) or 'なし'}\n\n"
        f"映画候補:\n{json.dumps(movie_list, ensure_ascii=False, indent=2)}\n\n"
        f"上記ユーザーに最も合う映画を1本選んでください。"
    )
    rec_id, reason = "", ""
    try:
        res = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model":  OLLAMA_MODEL,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False,
                "options": {"temperature": 0.1, "num_predict": 300},
            },
            timeout=180,
        )
        text = res.json().get("response", "")
        m = _re.search(r'\{.*?\}', text, _re.DOTALL)
        if m:
            parsed = json.loads(m.group())
            rec_id = str(parsed.get("recommended_movie_id", ""))
            reason = parsed.get("reason", "")
        print(f"[ollama] 推薦結果: id={rec_id} reason={reason[:40]}")
    except Exception as e:
        print(f"[ollama] エラー: {e}")

    if not rec_id or rec_id not in all_movies:
        pick   = random.choice(movie_list) if movie_list else {"id": "1"}
        rec_id = str(pick["id"])
        reason = reason or "あなたにおすすめの映画です。"

    recommended = []
    if rec_id in all_movies:
        m = all_movies[rec_id]
        recommended.append({
            "id":          m.get("id"),
            "title":       m.get("title"),
            "posterColor": m.get("posterColor", "#666"),
            "poster":      m.get("poster", ""),
            "score":       1.0,
            "why":         reason,
        })

    return jsonify({"reason": reason, "recommended_movies": recommended})


# ==================================================
# 映画推薦エンドポイント（フロントからJSONを受け取る）
# ==================================================
@app.route("/recommend/movies", methods=["POST"])
def recommend_movies():
    try:
        if "access_token" not in session:
            return jsonify({"error": "Not authenticated"}), 401

        if not OLLAMA_URL and not COLAB_URL:
            return jsonify({"error": "AI推薦サービスが設定されていません。"}), 503

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

        # ── Ollama（Docker内LLM）優先 ──────────────────
        if OLLAMA_URL:
            print(f"[ollama] 推薦リクエスト送信 - 候補: {len(movie_list)}本 model={OLLAMA_MODEL}")
            return _recommend_via_ollama(user_history, movie_list, all_movies)

        # ── Colab 経由（フォールバック） ────────────────
        print(f"[colab] 推薦リクエスト送信 - 候補: {len(movie_list)}本")
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

        return jsonify({"reason": reason, "recommended_movies": recommended})

    except requests.exceptions.Timeout:
        return jsonify({"error": "AI推薦サービスへの接続がタイムアウトしました（180秒）"}), 504
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ============================================
# REST API（DB連携）
# ============================================

def _parse_date_str(date_str: str):
    """
    "M/DD" 形式の文字列を date オブジェクトに変換する。
    上映は今後7日以内なので、今年か来年で判断する。
    """
    from datetime import date, timedelta
    try:
        parts = date_str.split("/")
        m, d = int(parts[0]), int(parts[1])
        today = date.today()
        candidate = date(today.year, m, d)
        if abs((candidate - today).days) > 15:
            candidate = date(today.year + 1, m, d)
        return candidate
    except Exception:
        return None


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


@app.route("/api/showings/find")
def api_find_showing():
    """
    映画ID・日付・スクリーン名・時刻から上映を特定し、予約済み座席を返す
    Query: movieId, date (M/DD), screen, time (HH:MM)
    Returns: { showingId, bookedSeats: ["A-1", ...] }
    """
    from models import Showing, Screen, BookingSeat, Seat
    from datetime import time as time_type

    movie_id = request.args.get("movieId", type=int)
    date_str  = request.args.get("date", "")
    screen_name = request.args.get("screen", "")
    time_str  = request.args.get("time", "")

    if not all([movie_id, date_str, screen_name, time_str]):
        return jsonify({"error": "パラメータが不足しています"}), 400

    show_date = _parse_date_str(date_str)
    if not show_date:
        return jsonify({"error": "日付の形式が正しくありません"}), 400

    try:
        h, m = map(int, time_str.split(":"))
        start_time = time_type(h, m)
    except Exception:
        return jsonify({"error": "時刻の形式が正しくありません"}), 400

    db = _get_db()
    try:
        screen = db.query(Screen).filter(Screen.name == screen_name).first()
        if not screen:
            return jsonify({"error": "スクリーンが見つかりません"}), 404

        showing = db.query(Showing).filter(
            Showing.movie_id == movie_id,
            Showing.screen_id == screen.screen_id,
            Showing.show_date == show_date,
            Showing.start_time == start_time,
        ).first()
        if not showing:
            return jsonify({"error": "上映が見つかりません"}), 404

        booked = (db.query(BookingSeat)
                  .join(Seat, BookingSeat.seat_id == Seat.seat_id)
                  .filter(BookingSeat.showing_id == showing.showing_id)
                  .all())
        booked_seats = [f"{bs.seat.seat_row}-{bs.seat.seat_col}" for bs in booked]

        return jsonify({"showingId": showing.showing_id, "bookedSeats": booked_seats})
    finally:
        db.close()


@app.route("/api/bookings", methods=["POST"])
def api_create_booking():
    """
    座席予約を作成する
    Body: { showingId, seats, ticketTypes, userEmail, lastName, firstName,
            lastNameKana, firstNameKana, gender, phone, payment }
    Returns: { bookingNo, bookingId, totalPrice }
    """
    from models import Showing, Seat, Member, Booking, BookingSeat, TicketType
    from sqlalchemy.exc import IntegrityError

    body = request.json or {}
    showing_id = body.get("showingId")
    seats = body.get("seats", [])
    ticket_types_map = body.get("ticketTypes", {})
    user_email   = body.get("userEmail", "")
    last_name    = body.get("lastName", "ゲスト")
    first_name   = body.get("firstName", "")
    last_name_kana  = body.get("lastNameKana", "")
    first_name_kana = body.get("firstNameKana", "")
    gender       = body.get("gender", "other")
    phone        = body.get("phone", "")

    if not showing_id or not seats:
        return jsonify({"error": "showingId と seats は必須です"}), 400

    ticket_type_name_map = {
        "general": "一般",
        "student": "大学生・専門学生",
        "senior":  "シニア",
        "child":   "小学生以下",
    }
    gender_map = {"男": "male", "女": "female", "どちらでもない": "other"}

    db = _get_db()
    try:
        showing = db.query(Showing).filter(Showing.showing_id == showing_id).first()
        if not showing:
            return jsonify({"error": "上映が見つかりません"}), 404

        # 会員ルックアップ（なければ作成）
        member = None
        if user_email:
            member = db.query(Member).filter(Member.email == user_email).first()
            if not member:
                member = Member(
                    email=user_email,
                    last_name=last_name or "ゲスト",
                    first_name=first_name or "",
                    last_name_kana=last_name_kana or "",
                    first_name_kana=first_name_kana or "",
                    gender=gender_map.get(gender, "other"),
                    phone=phone or "",
                    auth_provider="google",
                )
                db.add(member)
                db.flush()

        ticket_types = {t.name: t for t in db.query(TicketType).all()}

        # 予約番号を生成（重複時は再試行）
        for _ in range(5):
            booking_no = "HC-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not db.query(Booking).filter(Booking.booking_no == booking_no).first():
                break

        booking = Booking(
            member_id=member.member_id if member else None,
            showing_id=showing_id,
            booking_no=booking_no,
            status="confirmed",
        )
        db.add(booking)
        db.flush()

        total_price = 0
        for seat_key in seats:
            try:
                row, col_str = seat_key.split("-")
                col = int(col_str)
            except Exception:
                db.rollback()
                return jsonify({"error": f"座席形式が正しくありません: {seat_key}"}), 400

            seat = db.query(Seat).filter(
                Seat.screen_id == showing.screen_id,
                Seat.seat_row == row,
                Seat.seat_col == col,
            ).first()
            if not seat:
                db.rollback()
                return jsonify({"error": f"座席 {seat_key} が見つかりません"}), 404

            tt_key  = ticket_types_map.get(seat_key, "general")
            tt_name = ticket_type_name_map.get(tt_key, "一般")
            tt      = ticket_types.get(tt_name)
            if not tt:
                db.rollback()
                return jsonify({"error": f"チケット種別が見つかりません: {tt_name}"}), 404

            db.add(BookingSeat(
                booking_id=booking.booking_id,
                showing_id=showing_id,
                seat_id=seat.seat_id,
                ticket_type_id=tt.ticket_type_id,
                applied_price=tt.unit_price,
            ))
            total_price += tt.unit_price

        db.commit()
        return jsonify({
            "bookingNo":  booking_no,
            "bookingId":  booking.booking_id,
            "totalPrice": total_price,
        })

    except IntegrityError:
        db.rollback()
        return jsonify({"error": "選択した座席はすでに予約済みです。別の座席をお選びください。"}), 409
    except Exception as e:
        db.rollback()
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@app.route("/api/bookings/me")
def api_my_bookings():
    """
    ログインユーザーの予約一覧を返す
    Query: email
    Returns: [{ bookingNo, movieTitle, moviePoster, posterColor,
                showDate, startTime, screenName, seats, totalPrice, status, isPast }]
    """
    from models import Member, Booking, BookingSeat, Showing, Screen, Movie, Seat
    from datetime import datetime, timedelta, date

    email = request.args.get("email", "")
    if not email:
        return jsonify({"error": "email パラメータが必要です"}), 400

    db = _get_db()
    try:
        member = db.query(Member).filter(Member.email == email).first()
        if not member:
            return jsonify([])

        two_days_ago = date.today() - timedelta(days=2)

        bookings = (
            db.query(Booking)
            .filter(
                Booking.member_id == member.member_id,
                Booking.status != "cancelled",
            )
            .join(Showing, Booking.showing_id == Showing.showing_id)
            .filter(Showing.show_date >= two_days_ago)
            .order_by(Showing.show_date.desc(), Showing.start_time.desc())
            .all()
        )

        now = datetime.now()
        result = []
        for b in bookings:
            showing = b.showing
            screen  = showing.screen
            movie   = showing.movie

            booking_seats = (db.query(BookingSeat)
                             .join(Seat, BookingSeat.seat_id == Seat.seat_id)
                             .filter(BookingSeat.booking_id == b.booking_id)
                             .all())
            seats = [f"{bs.seat.seat_row}-{bs.seat.seat_col}" for bs in booking_seats]
            total = sum(bs.applied_price for bs in booking_seats)

            show_dt = datetime.combine(showing.show_date, showing.start_time)
            is_past = show_dt < now

            result.append({
                "bookingNo":  b.booking_no,
                "bookingId":  b.booking_id,
                "movieTitle": movie.title,
                "moviePoster": movie.poster_path or "",
                "posterColor": movie.poster_color or "#1a1a1a",
                "showDate":   showing.show_date.isoformat(),
                "startTime":  showing.start_time.strftime("%H:%M"),
                "screenName": screen.name,
                "seats":      seats,
                "totalPrice": total,
                "status":     b.status,
                "isPast":     is_past,
            })

        return jsonify(result)
    finally:
        db.close()


# Flaskアプリの起動（最後に1回だけ）
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
