from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine, text
import requests
import json

# Blueprintの作成。main.pyでこれを読み込みます。
chatbot_bp = Blueprint('chatbot', __name__)

# データベース接続情報 (Docker環境の環境変数などから取得できるように調整してください)
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/halcinema"
engine = create_engine(DATABASE_URL)

# ローカルのOllamaサーバーのURLとモデル名
OLLAMA_API_URL = "http://host.docker.internal:11434/api/chat"
MODEL_NAME = "movie-rec"


def get_now_showing_movies():
    """現在上映中の映画一覧を取得"""
    # 🌟 synopsis(あらすじ)の取得をやめて軽量化
    query = """
        SELECT title, rating, duration 
        FROM movies 
        WHERE release_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
        ORDER BY ranking ASC;
    """
    with engine.connect() as conn:
        result = conn.execute(text(query))
        movies = []
        for row in result:
            # 🌟 1行あたりの情報量をコンパクトに
            movies.append(f"・『{row.title}』({row.rating} / {row.duration}分)")
        return "\n".join(movies) if movies else "現在上映中の作品はありません。"
    
    

def get_campaigns():
    """実施中のキャンペーンや割引情報を取得"""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT title, subtitle, period, description FROM campaigns;"))
        campaigns = []
        for row in result:
            campaigns.append(f"★{row.title} ({row.subtitle})\n  期間: {row.period}\n  内容: {row.description}")
        return "\n\n".join(campaigns)

# 2. メインのチャットAPI
@chatbot_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    messages = data.get("messages", [])
    
    if not messages:
        return jsonify({"error": "メッセージが空です"}), 400

    # ユーザーの最新の質問を取得
    user_message = messages[-1]["content"]

    # 🌟【動的情報の取得】質問内容に応じてDBからコンテキストを引っ張る
    db_context = ""
    
    if any(k in user_message for k in ["料金", "いくら", "チケット", "学生", "シニア"]):
        db_context += f"\n【現在の基本チケット料金】\n{get_ticket_prices()}"
        
    if any(k in user_message for k in ["映画", "上映中", "おすすめ", "何やってる", "作品"]):
        db_context += f"\n【現在上映中の映画リスト】\n{get_now_showing_movies()}"
        
    if any(k in user_message for k in ["キャンペーン", "割引", "お得", "レディースデー", "友の会"]):
        db_context += f"\n【実施中のキャンペーン・割引情報】\n{get_campaigns()}"

    # 🌟【システムプロンプト（固定ルール）】
    # AIのキャラクター設定や、基本ルールをここに定義します。
    system_prompt = (
        "あなたは映画館「HAL CINEMA（ハルシネマ）」の親切なAIコンシェルジュです。\n"
        "以下の【提供された最新情報】がある場合は、必ずそのデータに基づいて回答してください。\n"
        "データベースにない情報（上映時間など）を聞かれた場合は、「公式サイトの上映スケジュールをご確認いただくか、直接劇場までお問い合わせください」と丁寧にお伝えしてください。\n"
        f"接客は丁寧に行い、語尾は「〜です」「〜ます」を統一してください。\n"
        f"{db_context}"
    )

    # Ollamaに渡すメッセージリストを構築
    # 過去の会話履歴を維持しつつ、先頭にシステムプロンプトを差し込む
    ollama_messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": MODEL_NAME,
                "messages": ollama_messages,
                "stream": False
            },
            timeout=120  # 🌟 30から120（2分）に延長
        )
        response.raise_for_status()
        ollama_data = response.json()
        
        return jsonify({
            "message": ollama_data.get("message", {}).get("content", "")
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ollamaとの通信に失敗しました: {str(e)}"}), 500