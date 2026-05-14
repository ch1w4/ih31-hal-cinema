### AIシステムで使用するpython環境の構築
AIシステムの開発には、Python 3.10以上が必要です。以下の手順で環境を構築してください。
1. **Pythonのインストール**  
   Python 3.10以上を公式サイトからダウンロードしてインストールしてください。  
   [Python公式サイト](https://www.python.org/downloads/)
2. **仮想環境の作成**
    ターミナルでプロジェクトディレクトリに移動し、以下のコマンドを実行して仮想環境を作成します。
    ```bash
    python -m venv venv
    ```
3. **仮想環境の有効化**
    - Windowsの場合:
      ```bash
      venv\Scripts\activate
      ```
    - macOS/Linuxの場合:
      ```bash
      source venv/bin/activate
      ```
4. **必要なパッケージのインストール**
    仮想環境が有効になった状態で、以下のコマンドを実行して必要なパッケージをインストールします。
    ```bash
    pip install fastapi pydantic sqlalchemy alembic python-jose[cryptography] psycopg2-binary redis flask requests flask-cors
    ```

---
http://localhost:5000/login
このurlに飛ぶとgoogleログインの画面へ飛びます
現在は私のgoogleアカウントのみが入れます。他入りたい方いればgmailのアドレスと共に申請してください



## 今後の予定
- FastAPIを使用してREST APIを構築し、フロントエンドと連携させる。



## wakameKメモ
複数のpythonファイルが競合しているため、main.pyを起動する際は以下のコマンドを使用してください。
C:\Users\black\AppData\Local\Programs\Python\Python312\python.exe main.py
