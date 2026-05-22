export type Movie = {
  id: string;
  title: string;
  titleEn: string;
  genre: string[];
  releaseDate: string;
  endDate: string;
  duration: number;
  rating: string;
  synopsis: string;
  cast: string[];
  director: string;
  posterColor: string;
  poster?: string;
  ranking?: number;
};

export type TimeSlot = {
  screen: string;
  times: string[];
};

export type ScheduleDay = {
  date: string;
  slots: TimeSlot[];
};

export const movies: Movie[] = [
  {
    id: "1",
    title: "カラダ探し",
    titleEn: "BODY SEARCH",
    genre: ["ホラー"],
    releaseDate: "2023-10-14",
    endDate: "2023-12-24",
    duration: 110,
    rating: "PG12",
    synopsis:
      "ある日突然、奇妙なゲームに巻き込まれた高校生たちの恐怖と謎を描いたホラーミステリー。毎夜繰り返される悪夢の中で、彼らは「カラダ」を探し続ける。",
    cast: ["橋本環奈", "眞栄田郷敦", "山本舞香", "神尾楓珠"],
    director: "羽住監督",
    posterColor: "#1a3a5c",
    poster: "/moviesamune/eiga1.jpg",
    ranking: 1,
  },
  {
    id: "2",
    title: "人はなぜラブレターを書くのか",
    titleEn: "WHY DO PEOPLE WRITE LOVE LETTERS?",
    genre: ["ドラマ", "歴史","恋愛"],
    releaseDate: "2026-04-17",
    endDate: "2026-06-30",
    duration: 130,
    rating: "G",
    synopsis:
      "戦後間もない日本。古書店で働く青年・蒼太は、亡き祖父が残した一通のラブレターを見つける。",
    cast: ["綾瀬はるか", "當真あみ", "細田佳央太"],
    director: "石井監督",
    posterColor: "#0a1a3a",
    poster: "/moviesamune/eiga2.jpg",
    ranking: 2,
  },
  {
    id: "3",
    title: "ジョーカー：フォリ・ア・ドゥ",
    titleEn: "Joker: Folie à Deux",
    genre: ["サスペンス", "ミュージカル"],
    releaseDate: "2024-10-11",
    endDate: "2025-01-31",
    duration: 118,
    rating: "PG12",
    synopsis:
      "2年前、世間を混乱させて悪のカリスマ“ジョーカー”となった青年アーサーは、殺人犯として逮捕されたが、精神面の問題から州立病院に収容されていた。そんな彼は院内の音楽療法の集会で彼の近所に住んでいたという女性ハーレイ・“リー”と出会う。",
    cast: ["ホアキン・フェニックス", "レディー・ガガ", "ブレンダン・グリーソン"],
    director: "トッド・フィリップス",
    posterColor: "#3a1a2a",
    poster: "/moviesamune/eiga3.jpg",
    ranking: 3,
  },
  {
    id: "4",
    title: "楓",
    titleEn: "MAPLE LEAVES",
    genre: ["ラブストーリー", "ヒューマンドラマ"],
    releaseDate: "2025-12-19",
    endDate: "2026-02-04",
    duration: 145,
    rating: "G",
    synopsis:
      "木下亜子と恋人の須永恵は、旅行先のニュージーランドで交通事故に遭い、恵は命を落としてしまいます",
    cast: ["福士蒼汰", "福原遥", "宮沢氷魚"],
    director: "行定監督",
    posterColor: "#2a1a0a",
    poster: "/moviesamune/eiga4.jpg",
    ranking: 4,
  },
  {
    id: "5",
    title: "怪盗グルーミニオン超変身",
    titleEn: "MINION THIEF: THE GREAT TRANSFORMATION",
    genre: ["コメディ", "ファミリー"],
    releaseDate: "2024-07-19",
    endDate: "2024-10-20",
    duration: 95,
    rating: "G",
    synopsis:
      "ある時、高校の同窓会に出席したグルーは、同級生でライバルだったマキシム・ル・マルと再会する。",
    cast: ["(声優)笑福亭鶴瓶", "(声優)片岡愛之助", "(声優)中島美嘉"],
    director: "クリス・ルノー監督",
    posterColor: "#1a3a1a",
    poster: "/moviesamune/eiga5.jpg",
    ranking: 5,
  },
  {
    id: "6",
    title: "呪術回線０",
    titleEn: "JUJUTSU KAISEN 0",
    genre: ["アニメ", "バトル"],
    releaseDate: "2021-12-24",
    endDate: "2024-02-28",
    duration: 122,
    rating: "G",
    synopsis:
      "呪術師たちが戦う、壮大なアニメ映画。",
    cast: ["緒方恵美", "花澤香菜", "中村悠一"],
    director: "朴監督",
    posterColor: "#0a2a3a",
    poster: "/moviesamune/eiga6.jpg",
    ranking: 6,
  },
  {
    id: "7",
    title: "プラダを着た悪魔2",
    titleEn: "THE DEVIL WEARS PRADA 2",
    genre: ["コメディ", "ファッション", "ドラマ"],
    releaseDate: "2026-05-01",
    endDate: "2026-08-05",
    duration: 112,
    rating: "G",
    synopsis:
      "ニューヨークの一流ファッション誌「ランウェイ」のカリスマ編集長として、ファッション業界の頂点に君臨するミランダ",
    cast: ["メリル・ストリープ", "アン・ハンサウェイ", "エミリー・ブラント","スタンリー・トゥッチ"],
    director: "デヴィッド・フランケル監督",
    posterColor: "#2a0a3a",
    poster: "/moviesamune/eiga7.jpg",
    ranking: 7,
  },
  {
    id: "8",
    title: "爆弾",
    titleEn: "BOMB",
    genre: ["サスペンス", "ミステリー", "クライム"],
    releaseDate: "2025-10-31",
    endDate: "2025-12-31",
    duration: 105,
    rating: "PG12",
    synopsis:
      "酔った勢いで自販機と店員に暴行を働き、警察に連行された正体不明の中年男。",
    cast: ["佐藤二郎", "山田祐樹貴", "伊藤沙莉"],
    director: "永井監督",
    posterColor: "#1a1a2a",
    poster: "/moviesamune/eiga8.jpg",
    ranking: 8,
  },
  {
    id: "9",
    title: "国宝",
    titleEn: "NATIONAL TREASURE",
    genre: ["ドラマ"],
    releaseDate: "2025-06-06",
    endDate: "2025-08-06",
    duration: 120,
    rating: "PG12",
    synopsis:
      "国宝級の美術品を巡る、アートと歴史のドラマ。失われた名画の謎を解き明かすため、若き美術史家が奔走する。",
    cast: ["吉沢亮", "森 七菜"],
    director: "李相日監督",
    posterColor: "#3a0a0a",
    poster: "/moviesamune/eiga9.jpg",
    ranking: 9,
  },
  {
    id: "10",
    title: "仮面ライダーガッチャード ザ・フューチャー・デイブレイク",
    titleEn: "KAMEN RIDER GATCHARD THE FUTURE DAYBREAK",
    genre: ["ドラマ", "青春"],
    releaseDate: "2025-11-18",
    endDate: "2026-01-21",
    duration: 108,
    rating: "G",
    synopsis:
      "ついに富良洲高校を卒業する日を迎えた一ノ瀬宝太郎や九堂りんねたち。",
    cast: ["本島純政", "松本麗世", "藤林泰也"],
    director: "山口監督",
    posterColor: "#2a2a0a",
    poster: "/moviesamune/eiga10.jpg",
    ranking: 10,
  },
  {
    id: "11",
    title: "ラストマン FIRST LOVE",
    titleEn: "Last Man FIRST LOVE",
    genre: ["サスペンス", "ミステリー"],
    releaseDate: "2025-12-24",
    endDate: "2026-02-28",
    duration: 116,
    rating: "G",
    synopsis:
      "特殊能力を持つ探偵が、難解な事件を次々と解決するアクションコメディ。",
    cast: ["福山雅治", "大泉洋", "永瀬廉"],
    director: "平野監督",
    posterColor: "#1a2a3a",
    poster: "/moviesamune/eiga11.jpg",
    ranking: 11,
  },
  {
    id: "12",
    title: "えんとつ町のプペル",
    titleEn: "Poupelle of Chimney Town",
    genre: ["アニメ", "ファンタジー"],
    releaseDate: "2026-03-27",
    endDate: "2026-05-31",
    duration: 135,
    rating: "G",
    synopsis:
      "えんとつ町が星空に包まれた奇跡の夜から1年が過ぎた。大切な親友プペルを失った少年ルビッチは再会を信じ続けていたが、前へ進むためあきらめてしまう。",
    cast: ["窪田正孝(声)", "永瀬ゆずな(声)", "立川志の輔(声)"],
    director: "廣田監督",
    posterColor: "#2a2a3a",
    poster: "/moviesamune/eiga12.jpg",
    ranking: 12,
  },
];

export const comingSoonMovies: Movie[] = [
  {
    id: "cs1",
    title: "おそ松さん 人類クズ化計画!!!!!?",
    titleEn: "OSOMATSU-SAN: HUMANITY KUZUFICATION PLAN!!!!!?",
    genre: ["アニメ", "コメディ"],
    releaseDate: "2026-06-06",
    endDate: "2026-08-31",
    duration: 95,
    rating: "G",
    synopsis: "6つ子がついに映画に降臨！人類をクズにしようとする謎の計画に巻き込まれたおそ松たちが、まさかの大冒険を繰り広げる。",
    cast: ["(声)櫻井孝宏", "(声)中村悠一", "(声)神谷浩史", "(声)福山潤", "(声)小野大輔", "(声)入野自由"],
    director: "藤田陽一監督",
    posterColor: "#1a3a1a",
    poster: "/moviesamune/cssamune/comingsoon1.jpg",
  },
  {
    id: "cs2",
    title: "クレヨンしんちゃん 超華麗灼熱のカスカベダンサーズ",
    titleEn: "CRAYON SHIN-CHAN: SUPER GORGEOUS SCORCHING KASUKABE DANCERS",
    genre: ["アニメ", "コメディ", "ファミリー"],
    releaseDate: "2026-06-13",
    endDate: "2026-09-07",
    duration: 100,
    rating: "G",
    synopsis: "春日部に謎のダンスブームが巻き起こる！しんのすけたちカスカベ防衛隊が、灼熱のダンスバトルで世界の危機に立ち向かう！",
    cast: ["(声)小林由美子", "(声)ならはしみき", "(声)矢島晶子"],
    director: "高橋渉監督",
    posterColor: "#3a2a0a",
    poster: "/moviesamune/cssamune/comingsoon2.jpg",
  },
  {
    id: "cs3",
    title: "はたらく細胞",
    titleEn: "CELLS AT WORK!",
    genre: ["アニメ", "アクション"],
    releaseDate: "2026-06-20",
    endDate: "2026-09-14",
    duration: 110,
    rating: "G",
    synopsis: "体の中で毎日奮闘する赤血球・白血球たちの知られざる闘いを描く。体内という舞台でくり広げられる迫力のアクションと感動の物語。",
    cast: ["(声)花澤香菜", "(声)前野智昭", "(声)井上和彦"],
    director: "小倉宏文監督",
    posterColor: "#3a0a0a",
    poster: "/moviesamune/cssamune/comingsoon3.jpg",
  },
  {
    id: "cs4",
    title: "Requiem",
    titleEn: "REQUIEM",
    genre: ["ドラマ", "サスペンス"],
    releaseDate: "2026-07-04",
    endDate: "2026-09-28",
    duration: 120,
    rating: "PG12",
    synopsis: "ある事件をきっかけに交錯する人々の運命。喪失と再生をテーマに描く重厚なヒューマンドラマ。",
    cast: ["未定"],
    director: "未定",
    posterColor: "#1a1a2a",
    poster: "/moviesamune/cssamune/comingsoon4.jpg",
  },
];

export const mockSchedules: Record<string, ScheduleDay[]> = {
  "1": [
    {
      date: "10/14",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "中スクリーン1", times: ["11:30", "15:00", "18:30"] },
      ],
    },
    {
      date: "10/15",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "中スクリーン1", times: ["11:30", "15:00"] },
      ],
    },
    {
      date: "10/16",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30", "17:00"] },
        { screen: "中スクリーン1", times: ["11:30", "15:00", "18:30", "21:00"] },
      ],
    },
    {
      date: "10/17",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "中スクリーン1", times: ["12:00", "15:30"] },
      ],
    },
    {
      date: "10/18",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "中スクリーン1", times: ["11:30", "15:00", "18:30"] },
      ],
    },
    {
      date: "10/19",
      slots: [
        { screen: "大スクリーン1", times: ["10:00", "13:30"] },
        { screen: "中スクリーン1", times: ["11:30", "15:00", "18:30", "21:00"] },
      ],
    },
  ],
};

export type Campaign = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  body: string;
  period: string;
  category: "キャンペーン" | "割引情報" | "会員情報" | "お知らせ";
  accentColor: string;
};

export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "春のわくわく映画キャンペーン",
    subtitle: "クラブスパイス会員限定",
    description: "毎週金曜1,100円 6回鑑賞で1本無料。ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！",
    body: `クラブスパイス会員の皆様限定の特別キャンペーンです。

【キャンペーン内容】
・毎週金曜日のご鑑賞が1,100円（通常1,900円）でお楽しみいただけます。
・対象作品を6回ご鑑賞いただくと、次回の鑑賞が1本無料になります。
・ファミリーで楽しめる対象作品をご鑑賞の方には、抽選で素敵なプレゼントが当たります。

【対象条件】
・クラブスパイス会員カードのご提示が必要です。
・金曜日の全上映時間が対象となります。
・一部特別上映は対象外となる場合がございます。

【プレゼント内容】
・特賞：旅行券（ペア）
・1等：HALシネマ年間パスポート（1名様）
・2等：映画鑑賞券10枚セット
・3等：オリジナルグッズセット

ぜひこの機会にクラブスパイス会員にご入会いただき、お得に映画をお楽しみください。`,
    period: "3.3(金)〜5.14(日)",
    category: "キャンペーン",
    accentColor: "#c0392b",
  },
  {
    id: "2",
    title: "HALシネマ友の会 会員募集中",
    subtitle: "お得な特典満載",
    description: "年会費無料！会員になると毎月1,000円割引クーポンプレゼント。ポイントが貯まるほどお得に映画を楽しめます。",
    body: `HALシネマ友の会は、映画をもっとお得に楽しみたい方のための会員プログラムです。

【会員特典】
・毎月1,000円割引クーポンを1枚プレゼント
・鑑賞ポイントが通常の2倍貯まる
・新作映画の先行試写会への招待（年2回）
・会員限定グッズの優先購入権
・誕生月は1,000円でご鑑賞いただけます

【入会方法】
受付カウンターにてお申し込みください。
入会費・年会費は無料です。
スマートフォンをお持ちの方はアプリからもご登録いただけます。

【ポイント制度】
・映画1本ご鑑賞ごとに100ポイント付与
・1,000ポイント = 映画1本無料鑑賞券に交換可能
・ポイントの有効期限は付与から1年間です

多くの皆様のご入会をお待ちしております。`,
    period: "随時受付中",
    category: "会員情報",
    accentColor: "#2980b9",
  },
  {
    id: "3",
    title: "レディースデー 毎週水曜日",
    subtitle: "女性限定1,100円",
    description: "毎週水曜日は女性のお客様が1,100円でご鑑賞いただけます。友達誘って映画を楽しもう！",
    body: `毎週水曜日はレディースデー！女性のお客様限定の特別割引デーです。

【割引内容】
・通常料金1,900円 → 1,100円（800円OFF）
・全作品・全上映時間が対象です

【ご注意事項】
・女性のお客様のみが対象となります。
・受付にて性別確認のため、身分証のご提示をお願いする場合がございます。
・一部特別上映・舞台挨拶付き上映は対象外となります。
・他の割引との併用はできません。

水曜日に友達と一緒に映画を楽しみましょう！`,
    period: "毎週水曜日",
    category: "割引情報",
    accentColor: "#8e44ad",
  },
  {
    id: "4",
    title: "シニア割引 60歳以上1,200円",
    subtitle: "毎日適用",
    description: "60歳以上の方は毎日1,200円でご鑑賞いただけます。証明書のご提示が必要です。",
    body: `60歳以上のお客様を対象としたシニア割引をご用意しております。

【割引内容】
・通常料金1,900円 → 1,200円（700円OFF）
・毎日・全上映時間が対象です
・全作品対象（一部特別上映を除く）

【必要なもの】
・年齢を確認できる公的証明書（運転免許証・健康保険証・マイナンバーカードなど）
・受付にてご提示をお願いいたします。

【ご注意事項】
・他の割引との併用はできません。
・特別料金上映・舞台挨拶付き上映は対象外となる場合があります。

映画でリフレッシュ。ぜひお近くのHALシネマへお越しください。`,
    period: "毎日",
    category: "割引情報",
    accentColor: "#27ae60",
  },
  {
    id: "5",
    title: "学生割引 大学生・専門学生1,500円",
    subtitle: "学生証提示で適用",
    description: "大学生・専門学生の方は学生証のご提示で1,500円でご鑑賞いただけます。",
    body: `大学生・専門学生の皆様に毎日使える学生割引をご提供しています。

【割引内容】
・通常料金1,900円 → 1,500円（400円OFF）
・毎日・全上映時間が対象です

【対象者】
・大学生（4年制・短期大学）
・専門学生（専門学校・各種学校）
・大学院生

【必要なもの】
・有効期限内の学生証
・受付にてご提示をお願いいたします。

【ご注意事項】
・高校生以下の方は別途「中高生割引」が適用されます。
・他の割引との併用はできません。
・一部特別上映は対象外となる場合があります。

勉強の合間に映画で気分転換しましょう！`,
    period: "毎日",
    category: "割引情報",
    accentColor: "#e67e22",
  },
  {
    id: "6",
    title: "新スクリーンOPEN！4DXシアター",
    subtitle: "体感型映画体験",
    description: "座席が動く！風が吹く！水しぶき！臨場感あふれる4DX体験を新スクリーンでお楽しみください。",
    body: `HALシネマに待望の4DXシアターがオープンしました！

【4DXとは】
映像と音響だけでなく、座席の動き・風・霧・香り・フラッシュなど様々な体感効果で映画の世界に没入できる次世代の映画体験です。

【設備概要】
・座席数：80席
・モーションシート：前後左右・上下に動く3軸モーション
・環境効果：風・霧・バブル・香り・フラッシュ・雷
・スクリーンサイズ：通常の1.5倍

【4DX料金】
・一般：3,000円
・会員：2,500円
・学生：2,500円
・シニア（60歳以上）：2,200円

【上映スケジュール】
毎日上映中。詳しくはタイムテーブルをご確認ください。

【ご注意事項】
・心臓疾患・妊娠中・乗り物酔いをしやすい方はご注意ください。
・水・霧が苦手な方は受付にてお申し出ください。
・3歳未満のお子様はご入場いただけません。`,
    period: "2024年1月オープン",
    category: "お知らせ",
    accentColor: "#1a6ea8",
  },
];
