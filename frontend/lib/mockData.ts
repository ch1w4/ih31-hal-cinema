// 型定義のみ。データは backend/db/movies_seed.sql → Flask API → lib/api.ts から取得する。

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

export type Campaign = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  body: string;
  period: string;
  category: "キャンペーン" | "割引情報" | "会員情報" | "お知らせ";
  accentColor: string;
  imageSrc: string;
};
