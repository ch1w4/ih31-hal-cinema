from flask import Blueprint, request, jsonify
import requests
import re
from datetime import date

# Blueprintの作成
chatbot_bp = Blueprint('chatbot', __name__)

# DockerからWindowsのOllamaに接続するためのURLとモデル名
OLLAMA_API_URL = "http://host.docker.internal:11434/api/chat"
MODEL_NAME = "movie-rec"


def validate_reply(reply, movies_info):
    """AIの返信で言及された映画がDB上に実在するか検証し、捏造タイトルのリストを返す"""
    valid_titles = set(re.findall(r"『(.+?)』", movies_info))
    mentioned_titles = re.findall(r"『(.+?)』", reply)
    hallucinated = [t for t in mentioned_titles if t not in valid_titles]
    return hallucinated


def ask_ollama(ollama_messages):
    response = requests.post(
        OLLAMA_API_URL,
        json={
            "model": MODEL_NAME,
            "messages": ollama_messages,
            "stream": False
        },
        timeout=120
    )
    response.raise_for_status()
    result = response.json()
    ai_message = result.get("message", {})
    return ai_message.get("content", "") if isinstance(ai_message, dict) else str(ai_message)

def summarize_history(messages):
    """直近の会話をテキストで要約してシステムプロンプトに埋め込む用"""
    if len(messages) <= 1:
        return "（これまでの会話なし）"
    # 直前のAI応答を除いた過去のやり取り（最新の1件は今回の質問なので除外）
    history = messages[:-1]
    lines = []
    for m in history[-10:]:  # 直近10件までのチャット記録を保持
        speaker = "お客様" if m["role"] == "user" else "アシスタント"
        lines.append(f"{speaker}: {m['content']}")
    return "\n".join(lines)


def get_movie_lookup():
    """DB上の全映画をタイトル→情報の辞書で返す（チャット返信のリンク化用）"""
    from database import SessionLocal
    from models import Movie

    db = SessionLocal()
    try:
        rows = db.query(Movie).all()
        return {
            m.title: {
                "id": m.movie_id,
                "title": m.title,
                "poster": m.poster_path or "",
                "posterColor": m.poster_color or "#1a1a1a",
            }
            for m in rows
        }
    finally:
        db.close()


def extract_mentioned_movies(reply_text, movie_lookup):
    """AIの返信文中に登場する映画タイトルを検出して情報を付与する"""
    return [info for title, info in movie_lookup.items() if title and title in reply_text]


def get_now_showing_movies():
    """データベースから現在上映中の映画一覧を取得（軽量版）"""
    from database import SessionLocal
    from models import Movie

    db = SessionLocal()
    try:
        today = date.today()
        # 上映終了日が今日以降、かつ上映開始が今日以前の映画を取得
        rows = (
            db.query(Movie)
            .filter((Movie.end_date >= today) | (Movie.end_date == None))
            .filter(Movie.release_date <= today)
            .order_by(Movie.ranking)
            .all()
        )
        if not rows:
            return "現在上映中の作品はありません。"

        movies = []
        for m in rows:
            movies.append(f"・『{m.title}』({m.rating or 'G'} / {m.duration or 0}分)")
        return "\n".join(movies)
    except Exception as e:
        print(f"[chatbot db error] 映画取得失敗: {e}")
        return "映画情報の取得に失敗しました。"
    finally:
        db.close()


def get_ticket_prices():
    """データベースからチケットの料金一覧を取得"""
    from database import SessionLocal
    from models import TicketType

    db = SessionLocal()
    try:
        rows = db.query(TicketType).order_by(TicketType.ticket_type_id).all()
        if not rows:
            return "料金情報が登録されていません。"

        prices = []
        for tt in rows:
            prices.append(f"・{tt.name}: {tt.unit_price}円")
        return "\n".join(prices)
    except Exception as e:
        print(f"[chatbot db error] 料金取得失敗: {e}")
        return "料金情報の取得に失敗しました。"
    finally:
        db.close()

@chatbot_bp.route('/api/chat', methods=['POST'])
def chat():
    """
    フロントエンドからのチャット履歴に、DBから取得したリアルタイム情報を付与して
    ローカルのOllamaに送信する
    """
    data = request.json or {}
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "メッセージが空です"}), 400

    # 1. データベースから最新の映画情報と料金情報を取得
    movies_info = get_now_showing_movies()
    prices_info = get_ticket_prices()

    history_text = summarize_history(messages)

    # 2. Ollama（AI）に与えるシステム指示書（前提知識）を作成
    system_prompt = f"""あなたはHALCINEMA（ハルシネマ）の優秀な予約アシスタント「シネマ・コンシェルジュ」です。
以下の映画情報と料金情報に基づいて、お客様の質問に親切かつ丁寧、そして簡潔に回答してください。
掲載されていない映画や、わからない質問には無理に答えず、一般論として答えるか確認を促してください。

【これまでの会話】
{history_text}

【現在上映中の映画一覧】
{movies_info}

【チケット料金一覧】
{prices_info}
"""

    # Ollamaに渡すのは最新の質問1件だけにする（履歴は上のシステムプロンプトに埋め込み済み）
    latest_user_message = messages[-1] if messages else {"role": "user", "content": ""}
    ollama_messages = [
        {"role": "system", "content": system_prompt},
        latest_user_message,
    ]

    # 3. Ollamaにリクエストを送信（捏造タイトルが出たら最大2回まで再考させる）
    try:
        max_retries = 2
        reply = None
        hallucinated = []

        for attempt in range(max_retries + 1):
            current_messages = list(ollama_messages)
            if attempt > 0:
                # 再考プロンプトを追加して、前回捏造したタイトルを名指しで注意する
                retry_note = (
                    f"※前回の回答で『{'』『'.join(hallucinated)}』という作品名を挙げましたが、"
                    "これは現在上映中の映画一覧に存在しません。"
                    "必ず【現在上映中の映画一覧】に記載されているタイトルの中から選び直してください。"
                )
                current_messages = current_messages + [{"role": "user", "content": retry_note}]

            reply = ask_ollama(current_messages)
            hallucinated = validate_reply(reply, movies_info)

            if not hallucinated:
                break  # 捏造なし→確定
            print(f"[chatbot warn] 捏造の疑いがある映画を検出（{attempt + 1}回目）: {hallucinated}")

        if hallucinated:
            # 規定回数リトライしても直らなかった場合のフォールバック
            reply = (
                "申し訳ございません、ご希望に合う作品をうまく確認できませんでした。"
                "恐れ入りますが、もう少し詳しくご希望のジャンルや雰囲気を教えていただけますか？"
            )

        movie_lookup = get_movie_lookup()
        mentioned_movies = extract_mentioned_movies(reply, movie_lookup)

        return jsonify({
            "reply": {"role": "assistant", "content": reply},
            "movies": mentioned_movies
        })

    except requests.exceptions.ConnectionError:
        return jsonify({"error": "ローカルAI（Ollama）に接続できません。Windows側でOllamaが起動しているか、OLLAMA_HOST環境変数が設定されているか確認してください。"}), 503
    except requests.exceptions.Timeout:
        return jsonify({"error": "AIからの応答がタイムアウトしました。しばらく待ってからもう一度お試しください。"}), 504
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500