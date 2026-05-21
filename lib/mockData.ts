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
    ranking: 2,
  },
  {
    id: "3",
    title: "ジョーカー：フォリ・ア・ドゥ",
    titleEn: "Joker: Folie à Deux",
    genre: ["サスペンス", "サスペンス", "ミステリー・ミュージカル"],
    releaseDate: "2024-10-11",
    endDate: "2025-01-31",
    duration: 118,
    rating: "PG12",
    synopsis:
      "2年前、世間を混乱させて悪のカリスマ“ジョーカー”となった青年アーサーは、殺人犯として逮捕されたが、精神面の問題から州立病院に収容されていた。そんな彼は院内の音楽療法の集会で彼の近所に住んでいたという女性ハーレイ・“リー”と出会う。",
    cast: ["ホアキン・フェニックス", "レディー・ガガ", "ブレンダン・グリーソン"],
    director: "トッド・フィリップス",
    posterColor: "#3a1a2a",
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
    ranking: 12,
  },
];

export const comingSoonMovies: Movie[] = [
  {
    id: "cs1",
    title: "新世界の扉",
    titleEn: "DOOR TO A NEW WORLD",
    genre: ["SF", "ファンタジー"],
    releaseDate: "2024-01-20",
    endDate: "2024-03-31",
    duration: 125,
    rating: "G",
    synopsis: "異世界への扉が開いた時、人類の命運が試される壮大なSFファンタジー。",
    cast: ["谷口勇", "藤原明日香"],
    director: "小林監督",
    posterColor: "#0a2a1a",
  },
  {
    id: "cs2",
    title: "赤い月の夜",
    titleEn: "NIGHT OF THE RED MOON",
    genre: ["ホラー", "スリラー"],
    releaseDate: "2024-02-03",
    endDate: "2024-04-14",
    duration: 98,
    rating: "R15+",
    synopsis: "赤い月が昇る夜、小さな村で起きる連続怪奇事件の真相を追う。",
    cast: ["松本拓哉", "河野美鈴"],
    director: "岡田監督",
    posterColor: "#3a0a1a",
  },
  {
    id: "cs3",
    title: "コードネーム：ゼロ",
    titleEn: "CODENAME: ZERO",
    genre: ["アクション", "スパイ"],
    releaseDate: "2024-02-17",
    endDate: "2024-04-28",
    duration: 140,
    rating: "PG12",
    synopsis:
      "伝説のスパイが引退後に再び戦場へ。組織の陰謀を暴く本格スパイアクション。",
    cast: ["大野信也", "小池真理", "平田勝"],
    director: "福田監督",
    posterColor: "#1a1a0a",
  },
  {
    id: "cs4",
    title: "春の風に乗って",
    titleEn: "RIDING THE SPRING BREEZE",
    genre: ["ロマンス", "ドラマ"],
    releaseDate: "2024-03-08",
    endDate: "2024-05-06",
    duration: 110,
    rating: "G",
    synopsis: "転勤で故郷に戻った女性と幼なじみの再会を描く、春の恋愛ドラマ。",
    cast: ["前田彩乃", "木下誠司"],
    director: "山口監督",
    posterColor: "#2a1a0a",
  },
];

export const mockSchedules: Record<string, ScheduleDay[]> = {
  "1": [
    {
      date: "10/14",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "シアター2", times: ["11:30", "15:00", "18:30"] },
      ],
    },
    {
      date: "10/15",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "シアター2", times: ["11:30", "15:00"] },
      ],
    },
    {
      date: "10/16",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30", "17:00"] },
        { screen: "シアター2", times: ["11:30", "15:00", "18:30", "21:00"] },
      ],
    },
    {
      date: "10/17",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "シアター2", times: ["12:00", "15:30"] },
      ],
    },
    {
      date: "10/18",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30", "17:00", "20:30"] },
        { screen: "シアター2", times: ["11:30", "15:00", "18:30"] },
      ],
    },
    {
      date: "10/19",
      slots: [
        { screen: "シアター1", times: ["10:00", "13:30"] },
        { screen: "シアター2", times: ["11:30", "15:00", "18:30", "21:00"] },
      ],
    },
  ],
};

export const campaigns = [
  {
    id: "1",
    title: "春のわくわく映画キャンペーン",
    subtitle: "クラブスパイス会員限定",
    description:
      "毎週金曜1,100円 6回鑑賞で1本無料。ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！",
    period: "3.3(金)〜5.14(日)",
    bgColor: "#e8f4fd",
    category: "キャンペーン",
  },
  {
    id: "2",
    title: "HALシネマ友の会 会員募集中",
    subtitle: "お得な特典満載",
    description:
      "年会費無料！会員になると毎月1,000円割引クーポンプレゼント。ポイントが貯まるほどお得に映画を楽しめます。",
    period: "随時受付中",
    bgColor: "#1a1a1a",
    category: "会員情報",
  },
  {
    id: "3",
    title: "レディースデー毎週水曜日",
    subtitle: "女性限定1,100円",
    description:
      "毎週水曜日は女性のお客様が1,100円でご鑑賞いただけます。友達誘って映画を楽しもう！",
    period: "毎週水曜日",
    bgColor: "#1a1a1a",
    category: "割引情報",
  },
  {
    id: "4",
    title: "シニア割引 60歳以上1,200円",
    subtitle: "毎日適用",
    description:
      "60歳以上の方は毎日1,200円でご鑑賞いただけます。証明書のご提示が必要です。",
    period: "毎日",
    bgColor: "#1a1a1a",
    category: "割引情報",
  },
  {
    id: "5",
    title: "学生割引 大学生・専門学生1,500円",
    subtitle: "学生証提示で適用",
    description:
      "大学生・専門学生の方は学生証のご提示で1,500円でご鑑賞いただけます。",
    period: "毎日",
    bgColor: "#1a1a1a",
    category: "割引情報",
  },
  {
    id: "6",
    title: "新スクリーンOPEN！4DXシアター",
    subtitle: "体感型映画体験",
    description:
      "座席が動く！風が吹く！水しぶき！臨場感あふれる4DX体験を新スクリーンでお楽しみください。",
    period: "2024年1月オープン",
    bgColor: "#1a1a1a",
    category: "お知らせ",
  },
];
