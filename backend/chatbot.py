from flask import Blueprint, request, jsonify
import requests
from datetime import date

# Blueprintの作成
chatbot_bp = Blueprint('chatbot', __name__)

# DockerからWindowsのOllamaに接続するためのURLとモデル名
OLLAMA_API_URL = "http://host.docker.internal:11434/api/chat"
MODEL_NAME = "movie-rec"


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

    # 2. Ollama（AI）に与えるシステム指示書（前提知識）を作成
    system_prompt = f"""あなたはHALCINEMA（ハルシネマ）の優秀な予約アシスタント「シネマ・コンシェルジュ」です。
以下の映画情報と料金情報に基づいて、お客様の質問に親切かつ丁寧、そして簡潔に回答してください。
掲載されていない映画や、わからない質問には無理に答えず、一般論として答えるか確認を促してください。

【現在上映中の映画一覧】
{movies_info}

【チケット料金一覧】
{prices_info}
"""

    # 3. チャット履歴の先頭にシステム指示を挿入する
    ollama_messages = [{"role": "system", "content": system_prompt}] + messages

    # 4. Ollamaにリクエストを送信
    try:
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": MODEL_NAME,
                "messages": ollama_messages,
                "stream": False
            },
            timeout=120  # AIの思考時間を考慮して2分まで待つ
        )
        response.raise_for_status()
        
        result = response.json()
        ai_message = result.get("message", {})

        return jsonify({
            "reply": ai_message
        })

    except requests.exceptions.ConnectionError:
        return jsonify({"error": "ローカルAI（Ollama）に接続できません。Windows側でOllamaが起動しているか、OLLAMA_HOST環境変数が設定されているか確認してください。"}), 503
    except requests.exceptions.Timeout:
        return jsonify({"error": "AIからの応答がタイムアウトしました。しばらく待ってからもう一度お試しください。"}), 504
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500