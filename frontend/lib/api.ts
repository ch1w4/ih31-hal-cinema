import type { Movie, Campaign, ScheduleDay } from "@/lib/mockData";

// サーバー側（Docker内）は INTERNAL_API_URL（backend サービス名）、
// ブラウザ側は NEXT_PUBLIC_API_URL（localhost）を使う
const API =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ?? "http://localhost:5000")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000");

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json() as Promise<T>;
}

export async function fetchMovies(): Promise<Movie[]> {
  return (await get<Movie[]>("/api/movies")) ?? [];
}

export async function fetchMovieById(id: string): Promise<Movie | null> {
  return get<Movie>(`/api/movies/${id}`);
}

export async function fetchComingSoon(): Promise<Movie[]> {
  return (await get<Movie[]>("/api/movies/coming-soon")) ?? [];
}

export async function fetchAllMovies(): Promise<Movie[]> {
  return (await get<Movie[]>("/api/movies/all")) ?? [];
}

export async function fetchShowings(movieId: string): Promise<ScheduleDay[]> {
  return (await get<ScheduleDay[]>(`/api/showings/${movieId}`)) ?? [];
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  return (await get<Campaign[]>("/api/campaigns")) ?? [];
}

export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  return get<Campaign>(`/api/campaigns/${id}`);
}

// ── 座席予約 ──────────────────────────────────────

export type OccupiedSeatsResult = {
  showingId: number;
  bookedSeats: string[];
};

export async function fetchOccupiedSeats(params: {
  movieId: string;
  date: string;
  screen: string;
  time: string;
}): Promise<OccupiedSeatsResult | null> {
  const qs = new URLSearchParams({
    movieId: params.movieId,
    date: params.date,
    screen: params.screen,
    time: params.time,
  });
  return get<OccupiedSeatsResult>(`/api/showings/find?${qs}`);
}

export type BookingRequest = {
  showingId: number;
  seats: string[];
  ticketTypes: Record<string, string>;
  userEmail: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: string;
  phone: string;
  payment: string;
};

export type BookingResult = {
  bookingNo: string;
  bookingId: number;
  totalPrice: number;
  error?: string;
};

export async function createBooking(data: BookingRequest): Promise<BookingResult> {
  try {
    return await post<BookingResult>("/api/bookings", data);
  } catch {
    return { bookingNo: "", bookingId: 0, totalPrice: 0, error: "通信エラーが発生しました" };
  }
}

export type MyBooking = {
  bookingNo: string;
  bookingId: number;
  movieTitle: string;
  moviePoster: string;
  posterColor: string;
  showDate: string;
  startTime: string;
  screenName: string;
  seats: string[];
  totalPrice: number;
  status: string;
  isPast: boolean;
};

export async function fetchMyBookings(email: string): Promise<MyBooking[]> {
  return (await get<MyBooking[]>(`/api/bookings/me?email=${encodeURIComponent(email)}`)) ?? [];
}
