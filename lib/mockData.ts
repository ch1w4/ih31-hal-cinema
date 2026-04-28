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
    genre: ["ホラー", "ミステリー"],
    releaseDate: "2023-10-14",
    endDate: "2023-12-24",
    duration: 110,
    rating: "PG12",
    synopsis:
      "ある日突然、奇妙なゲームに巻き込まれた高校生たちの恐怖と謎を描いたホラーミステリー。毎夜繰り返される悪夢の中で、彼らは「カラダ」を探し続ける。",
    cast: ["山田太郎", "佐藤花子", "鈴木一郎", "田中美咲"],
    director: "高橋監督",
    posterColor: "#1a3a5c",
    ranking: 1,
  },
  {
    id: "2",
    title: "銀河の果てで",
    titleEn: "AT THE EDGE OF THE GALAXY",
    genre: ["SF", "アドベンチャー"],
    releaseDate: "2023-10-07",
    endDate: "2023-12-31",
    duration: 130,
    rating: "G",
    synopsis:
      "人類最後の宇宙探検隊が、未知の銀河の果てで遭遇する壮大な冒険。宇宙の神秘と人間の絆を描いたSF超大作。",
    cast: ["伊藤健一", "渡辺美月", "中村俊介"],
    director: "森田監督",
    posterColor: "#0a1a3a",
    ranking: 2,
  },
  {
    id: "3",
    title: "桜が散る前に",
    titleEn: "BEFORE THE CHERRY BLOSSOMS FALL",
    genre: ["ドラマ", "ロマンス"],
    releaseDate: "2023-09-23",
    endDate: "2023-11-30",
    duration: 118,
    rating: "G",
    synopsis:
      "余命宣告を受けた女性と、彼女を支える男性の純愛を描いた感動の恋愛ドラマ。",
    cast: ["小林恵美", "加藤拓也", "山本由美"],
    director: "松本監督",
    posterColor: "#3a1a2a",
    ranking: 3,
  },
  {
    id: "4",
    title: "最後の侍",
    titleEn: "THE LAST SAMURAI",
    genre: ["時代劇", "アクション"],
    releaseDate: "2023-10-21",
    endDate: "2024-01-14",
    duration: 145,
    rating: "PG12",
    synopsis:
      "江戸時代末期、時代の流れに逆らう一人の侍の生きざまを描いた大河ドラマ。",
    cast: ["武田剛", "大島美穂", "岡田信二"],
    director: "村上監督",
    posterColor: "#2a1a0a",
    ranking: 4,
  },
  {
    id: "5",
    title: "笑顔の教室",
    titleEn: "CLASSROOM OF SMILES",
    genre: ["コメディ", "ファミリー"],
    releaseDate: "2023-10-14",
    endDate: "2023-12-10",
    duration: 95,
    rating: "G",
    synopsis:
      "型破りな新任教師が、問題を抱えた子どもたちと共に成長する心温まるコメディ。",
    cast: ["橋本健太", "清水さゆり", "福田龍司"],
    director: "石田監督",
    posterColor: "#1a3a1a",
    ranking: 5,
  },
  {
    id: "6",
    title: "深海の秘密",
    titleEn: "SECRETS OF THE DEEP SEA",
    genre: ["アドベンチャー", "スリラー"],
    releaseDate: "2023-11-03",
    endDate: "2024-01-28",
    duration: 122,
    rating: "PG12",
    synopsis:
      "深海調査船のクルーが、謎の生命体と遭遇する海洋スリラー大作。",
    cast: ["長谷川誠", "坂本里奈", "藤田光一"],
    director: "西川監督",
    posterColor: "#0a2a3a",
    ranking: 6,
  },
  {
    id: "7",
    title: "夢を追いかけて",
    titleEn: "CHASING DREAMS",
    genre: ["青春", "音楽"],
    releaseDate: "2023-10-28",
    endDate: "2023-12-24",
    duration: 112,
    rating: "G",
    synopsis:
      "音楽の夢を諦めかけた若者たちが、バンドを組んで再挑戦する青春音楽映画。",
    cast: ["松田優作", "安藤美咲", "田村健"],
    director: "中川監督",
    posterColor: "#2a0a3a",
    ranking: 7,
  },
  {
    id: "8",
    title: "幽霊屋敷の謎",
    titleEn: "MYSTERY OF THE HAUNTED HOUSE",
    genre: ["ホラー", "コメディ"],
    releaseDate: "2023-11-10",
    endDate: "2024-01-07",
    duration: 105,
    rating: "PG12",
    synopsis:
      "古い洋館に住み着いた幽霊たちと、引っ越してきた家族の笑えるホラーコメディ。",
    cast: ["木村実", "浜田裕子", "井上俊"],
    director: "高田監督",
    posterColor: "#1a1a2a",
    ranking: 8,
  },
  {
    id: "9",
    title: "鬼滅の彼方",
    titleEn: "BEYOND THE DEMON SLAYER",
    genre: ["アニメ", "アクション"],
    releaseDate: "2023-12-01",
    endDate: "2024-02-28",
    duration: 120,
    rating: "PG12",
    synopsis:
      "鬼と人間が共存する世界で、一人の少年が宿命の戦いに挑む壮大なアニメ映画。",
    cast: ["(声優)山崎賢人", "(声優)土屋太鳳"],
    director: "アニメスタジオ制作",
    posterColor: "#3a0a0a",
    ranking: 9,
  },
  {
    id: "10",
    title: "永遠の夏",
    titleEn: "ETERNAL SUMMER",
    genre: ["ドラマ", "青春"],
    releaseDate: "2023-11-18",
    endDate: "2024-01-21",
    duration: 108,
    rating: "G",
    synopsis:
      "海辺の小さな町で出会った三人の若者が過ごす、忘れられない夏の物語。",
    cast: ["青木涼太", "村田美和", "杉山浩二"],
    director: "金子監督",
    posterColor: "#2a2a0a",
    ranking: 10,
  },
  {
    id: "11",
    title: "超人探偵",
    titleEn: "SUPERHUMAN DETECTIVE",
    genre: ["アクション", "コメディ"],
    releaseDate: "2023-10-21",
    endDate: "2023-12-17",
    duration: 116,
    rating: "G",
    synopsis:
      "特殊能力を持つ探偵が、難解な事件を次々と解決するアクションコメディ。",
    cast: ["吉田剛", "中島彩", "斎藤隆"],
    director: "池田監督",
    posterColor: "#1a2a3a",
    ranking: 11,
  },
  {
    id: "12",
    title: "白銀の頂へ",
    titleEn: "TO THE SILVER SUMMIT",
    genre: ["ドラマ", "アドベンチャー"],
    releaseDate: "2023-12-15",
    endDate: "2024-02-11",
    duration: 135,
    rating: "G",
    synopsis:
      "登山家チームが挑む世界最高峰への過酷な挑戦。友情と限界を描いた山岳ドラマ。",
    cast: ["橋本竜也", "白石美咲", "黒田孝一"],
    director: "山田監督",
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
