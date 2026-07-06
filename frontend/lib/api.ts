import type { Movie, Campaign, ScheduleDay } from "@/lib/mockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
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
