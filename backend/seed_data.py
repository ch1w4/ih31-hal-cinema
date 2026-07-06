"""
DB が空のときに自動でシードデータを投入する。
main.py の init_db() から呼ばれる。
"""
from datetime import date, timedelta, time


def seed(db):
    from models import (
        Genre, CastMember, Movie, MovieGenre, MovieCast,
        Screen, Seat, TicketType, Showing, Campaign
    )

    # 既にデータがあればスキップ
    if db.query(Movie).count() > 0:
        return

    print("[seed] 初期データを投入します...")

    # ──────────────────────────────────────────────
    # ジャンル
    # ──────────────────────────────────────────────
    genre_names = [
        "ホラー", "ドラマ", "歴史", "恋愛", "サスペンス", "ミュージカル",
        "ラブストーリー", "ヒューマンドラマ", "コメディ", "ファミリー",
        "アニメ", "バトル", "ファッション", "ミステリー", "クライム",
        "青春", "SF", "ロマンス", "ドキュメンタリー", "ファンタジー", "アクション",
    ]
    genres = {}
    for name in genre_names:
        g = Genre(name=name)
        db.add(g)
        genres[name] = g
    db.flush()

    # ──────────────────────────────────────────────
    # キャスト
    # ──────────────────────────────────────────────
    cast_names = [
        "橋本環奈", "眞栄田郷敦", "山本舞香", "神尾楓珠",
        "綾瀬はるか", "當真あみ", "細田佳央太",
        "ホアキン・フェニックス", "レディー・ガガ", "ブレンダン・グリーソン",
        "福士蒼汰", "福原遥", "宮沢氷魚",
        "(声優)笑福亭鶴瓶", "(声優)片岡愛之助", "(声優)中島美嘉",
        "緒方恵美", "花澤香菜", "中村悠一",
        "メリル・ストリープ", "アン・ハンサウェイ", "エミリー・ブラント", "スタンリー・トゥッチ",
        "佐藤二郎", "山田祐樹貴", "伊藤沙莉",
        "吉沢亮", "森 七菜",
        "本島純政", "松本麗世", "藤林泰也",
        "福山雅治", "大泉洋", "永瀬廉",
        "窪田正孝(声)", "永瀬ゆずな(声)", "立川志の輔(声)",
        "(声)櫻井孝宏", "(声)神谷浩史", "(声)福山潤", "(声)小野大輔", "(声)入野自由",
        "(声)小林由美子", "(声)ならはしみき", "(声)矢島晶子",
        "(声)前野智昭", "(声)井上和彦",
        "未定",
    ]
    casts = {}
    for name in cast_names:
        c = CastMember(name=name)
        db.add(c)
        casts[name] = c
    db.flush()

    # ──────────────────────────────────────────────
    # スクリーン & 座席
    # ──────────────────────────────────────────────
    screens_def = [
        ("大スクリーン1", "large",  [("A","B","C"), 16, ("D","E","F","G","H","I"), 13]),
        ("中スクリーン1", "medium", [("A","B","C","D","E","F","G","H"), 15]),
        ("小スクリーン1", "small",  [("A","B","C","D","E","F","G"), 10]),
    ]
    screens = {}
    for name, stype, layout in screens_def:
        s = Screen(name=name, screen_type=stype)
        db.add(s)
        db.flush()
        screens[name] = s
        if stype == "large":
            top_rows, top_cols, bot_rows, bot_cols = layout
            for row in top_rows:
                for col in range(1, top_cols + 1):
                    db.add(Seat(screen_id=s.screen_id, seat_row=row, seat_col=col))
            for row in bot_rows:
                for col in range(1, bot_cols + 1):
                    db.add(Seat(screen_id=s.screen_id, seat_row=row, seat_col=col))
        else:
            rows, cols = layout[0], layout[1]
            for row in rows:
                for col in range(1, cols + 1):
                    db.add(Seat(screen_id=s.screen_id, seat_row=row, seat_col=col))
    db.flush()

    # ──────────────────────────────────────────────
    # 券種
    # ──────────────────────────────────────────────
    for name, price in [("一般", 1900), ("大学生・専門学生", 1500), ("シニア", 1200), ("小学生以下", 1000)]:
        db.add(TicketType(name=name, unit_price=price))
    db.flush()

    # ──────────────────────────────────────────────
    # 映画データ（日付は today 基準で相対計算）
    # ──────────────────────────────────────────────
    _ns_start = today - timedelta(days=30)   # now showing: 30日前から
    _ns_end   = today + timedelta(days=90)   # now showing: 90日後まで
    movies_data = [
        # id, title, title_en, synopsis, duration, rating, director, release_date, end_date, poster_path, poster_color, ranking, genres[], casts[]
        (1,  "カラダ探し",  "BODY SEARCH",
         "ある日突然、奇妙なゲームに巻き込まれた高校生たちの恐怖と謎を描いたホラーミステリー。毎夜繰り返される悪夢の中で、彼らは「カラダ」を探し続ける。",
         110, "PG12", "羽住監督", _ns_start, _ns_end, "/moviesamune/eiga1.jpg", "#1a3a5c", 1,
         ["ホラー"], ["橋本環奈","眞栄田郷敦","山本舞香","神尾楓珠"]),

        (2,  "人はなぜラブレターを書くのか", "WHY DO PEOPLE WRITE LOVE LETTERS?",
         "戦後間もない日本。古書店で働く青年・蒼太は、亡き祖父が残した一通のラブレターを見つける。",
         130, "G", "石井監督", _ns_start, _ns_end, "/moviesamune/eiga2.jpg", "#0a1a3a", 2,
         ["ドラマ","歴史","恋愛"], ["綾瀬はるか","當真あみ","細田佳央太"]),

        (3,  "ジョーカー：フォリ・ア・ドゥ", "Joker: Folie à Deux",
         "2年前、世間を混乱させて悪のカリスマ「ジョーカー」となった青年アーサーは、殺人犯として逮捕されたが、精神面の問題から州立病院に収容されていた。そんな彼は院内の音楽療法の集会で彼の近所に住んでいたという女性ハーレイ・「リー」と出会う。",
         118, "PG12", "トッド・フィリップス", _ns_start, _ns_end, "/moviesamune/eiga3.jpg", "#3a1a2a", 3,
         ["サスペンス","ミュージカル"], ["ホアキン・フェニックス","レディー・ガガ","ブレンダン・グリーソン"]),

        (4,  "楓", "MAPLE LEAVES",
         "木下亜子と恋人の須永恵は、旅行先のニュージーランドで交通事故に遭い、恵は命を落としてしまいます",
         145, "G", "行定監督", _ns_start, _ns_end, "/moviesamune/eiga4.jpg", "#2a1a0a", 4,
         ["ラブストーリー","ヒューマンドラマ"], ["福士蒼汰","福原遥","宮沢氷魚"]),

        (5,  "怪盗グルーミニオン超変身", "MINION THIEF: THE GREAT TRANSFORMATION",
         "ある時、高校の同窓会に出席したグルーは、同級生でライバルだったマキシム・ル・マルと再会する。",
         95, "G", "クリス・ルノー監督", _ns_start, _ns_end, "/moviesamune/eiga5.jpg", "#1a3a1a", 5,
         ["コメディ","ファミリー"], ["(声優)笑福亭鶴瓶","(声優)片岡愛之助","(声優)中島美嘉"]),

        (6,  "呪術回線０", "JUJUTSU KAISEN 0",
         "呪術師たちが戦う、壮大なアニメ映画。",
         122, "G", "朴監督", _ns_start, _ns_end, "/moviesamune/eiga6.jpg", "#0a2a3a", 6,
         ["アニメ","バトル"], ["緒方恵美","花澤香菜","中村悠一"]),

        (7,  "プラダを着た悪魔2", "THE DEVIL WEARS PRADA 2",
         "ニューヨークの一流ファッション誌「ランウェイ」のカリスマ編集長として、ファッション業界の頂点に君臨するミランダ",
         112, "G", "デヴィッド・フランケル監督", _ns_start, _ns_end, "/moviesamune/eiga7.jpg", "#2a0a3a", 7,
         ["コメディ","ファッション","ドラマ"], ["メリル・ストリープ","アン・ハンサウェイ","エミリー・ブラント","スタンリー・トゥッチ"]),

        (8,  "爆弾", "BOMB",
         "酔った勢いで自販機と店員に暴行を働き、警察に連行された正体不明の中年男。",
         105, "PG12", "永井監督", _ns_start, _ns_end, "/moviesamune/eiga8.jpg", "#1a1a2a", 8,
         ["サスペンス","ミステリー","クライム"], ["佐藤二郎","山田祐樹貴","伊藤沙莉"]),

        (9,  "国宝", "NATIONAL TREASURE",
         "国宝級の美術品を巡る、アートと歴史のドラマ。失われた名画の謎を解き明かすため、若き美術史家が奔走する。",
         120, "PG12", "李相日監督", _ns_start, _ns_end, "/moviesamune/eiga9.jpg", "#3a0a0a", 9,
         ["ドラマ"], ["吉沢亮","森 七菜"]),

        (10, "仮面ライダーガッチャード ザ・フューチャー・デイブレイク", "KAMEN RIDER GATCHARD THE FUTURE DAYBREAK",
         "ついに富良洲高校を卒業する日を迎えた一ノ瀬宝太郎や九堂りんねたち。",
         108, "G", "山口監督", _ns_start, _ns_end, "/moviesamune/eiga10.jpg", "#2a2a0a", 10,
         ["ドラマ","青春"], ["本島純政","松本麗世","藤林泰也"]),

        (11, "ラストマン FIRST LOVE", "Last Man FIRST LOVE",
         "特殊能力を持つ探偵が、難解な事件を次々と解決するアクションコメディ。",
         116, "G", "平野監督", _ns_start, _ns_end, "/moviesamune/eiga11.jpg", "#1a2a3a", 11,
         ["サスペンス","ミステリー"], ["福山雅治","大泉洋","永瀬廉"]),

        (12, "えんとつ町のプペル", "Poupelle of Chimney Town",
         "えんとつ町が星空に包まれた奇跡の夜から1年が過ぎた。大切な親友プペルを失った少年ルビッチは再会を信じ続けていたが、前へ進むためあきらめてしまう。",
         135, "G", "廣田監督", _ns_start, _ns_end, "/moviesamune/eiga12.jpg", "#2a2a3a", 12,
         ["アニメ","ファンタジー"], ["窪田正孝(声)","永瀬ゆずな(声)","立川志の輔(声)"]),

        # 上映予定
        (13, "おそ松さん 人類クズ化計画!!!!!?", "OSOMATSU-SAN: HUMANITY KUZUFICATION PLAN!!!!!?",
         "6つ子がついに映画に降臨！人類をクズにしようとする謎の計画に巻き込まれたおそ松たちが、まさかの大冒険を繰り広げる。",
         95, "G", "藤田陽一監督",
         today + timedelta(days=30), today + timedelta(days=120),
         "/moviesamune/cssamune/comingsoon1.jpg", "#1a3a1a", None,
         ["アニメ","コメディ"], ["(声)櫻井孝宏","(声)神谷浩史","(声)福山潤","(声)小野大輔","(声)入野自由"]),

        (14, "クレヨンしんちゃん 超華麗灼熱のカスカベダンサーズ", "CRAYON SHIN-CHAN: SUPER GORGEOUS SCORCHING KASUKABE DANCERS",
         "春日部に謎のダンスブームが巻き起こる！しんのすけたちカスカベ防衛隊が、灼熱のダンスバトルで世界の危機に立ち向かう！",
         100, "G", "高橋渉監督",
         today + timedelta(days=45), today + timedelta(days=135),
         "/moviesamune/cssamune/comingsoon2.jpg", "#3a2a0a", None,
         ["アニメ","コメディ","ファミリー"], ["(声)小林由美子","(声)ならはしみき","(声)矢島晶子"]),

        (15, "はたらく細胞", "CELLS AT WORK!",
         "体の中で毎日奮闘する赤血球・白血球たちの知られざる闘いを描く。体内という舞台でくり広げられる迫力のアクションと感動の物語。",
         110, "G", "小倉宏文監督",
         today + timedelta(days=60), today + timedelta(days=150),
         "/moviesamune/cssamune/comingsoon3.jpg", "#3a0a0a", None,
         ["アニメ","アクション"], ["花澤香菜","(声)前野智昭","(声)井上和彦"]),

        (16, "Requiem", "REQUIEM",
         "ある事件をきっかけに交錯する人々の運命。喪失と再生をテーマに描く重厚なヒューマンドラマ。",
         120, "PG12", "未定",
         today + timedelta(days=75), today + timedelta(days=165),
         "/moviesamune/cssamune/comingsoon4.jpg", "#1a1a2a", None,
         ["ドラマ","サスペンス"], ["未定"]),
    ]

    movie_objs = {}
    for row in movies_data:
        mid, title, title_en, synopsis, duration, rating, director, rel, end, poster, color, ranking, gnames, cnames = row
        m = Movie(
            movie_id=mid, title=title, title_en=title_en, synopsis=synopsis,
            duration=duration, rating=rating, director=director,
            release_date=rel, end_date=end, poster_path=poster,
            poster_color=color, ranking=ranking,
        )
        db.add(m)
        db.flush()
        movie_objs[mid] = (m, gnames, cnames)

    db.flush()

    # ジャンル・キャスト紐付け
    for mid, (m, gnames, cnames) in movie_objs.items():
        for gname in gnames:
            if gname in genres:
                db.add(MovieGenre(movie_id=m.movie_id, genre_id=genres[gname].genre_id))
        for cname in cnames:
            if cname in casts:
                db.add(MovieCast(movie_id=m.movie_id, cast_id=casts[cname].cast_id))
    db.flush()

    # ──────────────────────────────────────────────
    # 上映スケジュール（今日から7日間、映画ごとに専用スロット）
    # UNIQUE制約 (screen_id, show_date, start_time) に違反しないよう
    # 各映画を異なるスクリーン・時間帯に割り当てる
    # ──────────────────────────────────────────────
    large  = screens["大スクリーン1"]
    medium = screens["中スクリーン1"]
    small  = screens["小スクリーン1"]

    # movie_id → (screen, start_time) の固定割り当て
    slot_map = {
        1:  (large,  time(10, 0)),
        2:  (large,  time(13, 30)),
        3:  (large,  time(17, 0)),
        4:  (large,  time(20, 30)),
        5:  (medium, time(11, 30)),
        6:  (medium, time(15, 0)),
        7:  (medium, time(18, 30)),
        8:  (small,  time(12, 0)),
        9:  (small,  time(16, 0)),
        10: (small,  time(19, 30)),
        11: (large,  time(8, 0)),
        12: (small,  time(10, 0)),
    }

    for mid, (screen, start) in slot_map.items():
        if mid not in movie_objs:
            continue
        for delta in range(7):
            d = today + timedelta(days=delta)
            db.add(Showing(movie_id=mid, screen_id=screen.screen_id, show_date=d, start_time=start))
    db.flush()

    # ──────────────────────────────────────────────
    # キャンペーン
    # ──────────────────────────────────────────────
    campaigns_data = [
        (1, "春のわくわく映画キャンペーン", "クラブスパイス会員限定",
         "毎週金曜1,100円 6回鑑賞で1本無料。ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！",
         "クラブスパイス会員の皆様限定の特別キャンペーンです。\n\n【キャンペーン内容】\n・毎週金曜日のご鑑賞が1,100円（通常1,900円）でお楽しみいただけます。\n・対象作品を6回ご鑑賞いただくと、次回の鑑賞が1本無料になります。\n・ファミリーで楽しめる対象作品をご鑑賞の方には、抽選で素敵なプレゼントが当たります。\n\n【プレゼント内容】\n・特賞：旅行券（ペア）\n・1等：HALシネマ年間パスポート（1名様）\n・2等：映画鑑賞券10枚セット\n・3等：オリジナルグッズセット",
         "3.3(金)〜5.14(日)", "キャンペーン", "/images/hero/わくわく.png", "#c0392b"),

        (2, "HALシネマ友の会 会員募集中", "お得な特典満載",
         "年会費無料！会員になると毎月1,000円割引クーポンプレゼント。ポイントが貯まるほどお得に映画を楽しめます。",
         "HALシネマ友の会は、映画をもっとお得に楽しみたい方のための会員プログラムです。\n\n【会員特典】\n・毎月1,000円割引クーポンを1枚プレゼント\n・鑑賞ポイントが通常の2倍貯まる\n・新作映画の先行試写会への招待（年2回）\n・誕生月は1,000円でご鑑賞いただけます\n\n【ポイント制度】\n・映画1本ご鑑賞ごとに100ポイント付与\n・1,000ポイント = 映画1本無料鑑賞券に交換可能",
         "随時受付中", "会員情報", "/images/hero/HAL友.png", "#2980b9"),

        (3, "レディースデー 毎週水曜日", "女性限定1,100円",
         "毎週水曜日は女性のお客様が1,100円でご鑑賞いただけます。友達誘って映画を楽しもう！",
         "毎週水曜日はレディースデー！女性のお客様限定の特別割引デーです。\n\n【割引内容】\n・通常料金1,900円 → 1,100円（800円OFF）\n・全作品・全上映時間が対象です\n\n【ご注意事項】\n・女性のお客様のみが対象となります。\n・他の割引との併用はできません。",
         "毎週水曜日", "割引情報", "/images/hero/レディース.png", "#8e44ad"),

        (4, "シニア割引 60歳以上1,200円", "毎日適用",
         "60歳以上の方は毎日1,200円でご鑑賞いただけます。証明書のご提示が必要です。",
         "60歳以上のお客様を対象としたシニア割引をご用意しております。\n\n【割引内容】\n・通常料金1,900円 → 1,200円（700円OFF）\n・毎日・全上映時間が対象です\n\n【必要なもの】\n・年齢を確認できる公的証明書（運転免許証・健康保険証・マイナンバーカードなど）",
         "毎日", "割引情報", "/images/hero/シニア.png", "#27ae60"),

        (5, "学生割引 大学生・専門学生1,500円", "学生証提示で適用",
         "大学生・専門学生の方は学生証のご提示で1,500円でご鑑賞いただけます。",
         "大学生・専門学生の皆様に毎日使える学生割引をご提供しています。\n\n【割引内容】\n・通常料金1,900円 → 1,500円（400円OFF）\n・毎日・全上映時間が対象です\n\n【対象者】\n・大学生（4年制・短期大学）・専門学生・大学院生",
         "毎日", "割引情報", "/images/hero/学生.png", "#e67e22"),

        (6, "新スクリーンOPEN！4DXシアター", "体感型映画体験",
         "座席が動く！風が吹く！水しぶき！臨場感あふれる4DX体験を新スクリーンでお楽しみください。",
         "HALシネマに待望の4DXシアターがオープンしました！\n\n【4DX料金】\n・一般：3,000円\n・会員：2,500円\n・学生：2,500円\n・シニア（60歳以上）：2,200円\n\n【ご注意事項】\n・心臓疾患・妊娠中・乗り物酔いをしやすい方はご注意ください。\n・3歳未満のお子様はご入場いただけません。",
         "2024年1月オープン", "お知らせ", "/images/hero/4dx.png", "#1a6ea8"),
    ]
    for row in campaigns_data:
        cid, title, subtitle, description, body, period, category, image_path, accent_color = row
        db.add(Campaign(
            campaign_id=cid, title=title, subtitle=subtitle,
            description=description, body=body, period=period,
            category=category, image_path=image_path, accent_color=accent_color,
        ))

    # シーケンスを挿入済み最大IDに合わせる
    from sqlalchemy import text
    for tbl, col in [("movies", "movie_id"), ("campaigns", "campaign_id")]:
        try:
            db.execute(text(
                f"SELECT setval(pg_get_serial_sequence('{tbl}', '{col}'), "
                f"(SELECT COALESCE(MAX({col}), 1) FROM {tbl}))"
            ))
        except Exception:
            pass  # シーケンスなしの環境（SQLite等）では無視

    db.commit()
    print("[seed] 初期データの投入が完了しました。")
