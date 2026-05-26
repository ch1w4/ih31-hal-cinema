"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { movies, comingSoonMovies } from "@/lib/mockData";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleLogin() {
      const token = searchParams.get("token");
      const userEncoded = searchParams.get("user");

      if (!token || !userEncoded) {
        router.push("/login");
        return;
      }

      try {
        const userJson = atob(userEncoded);
        const user = JSON.parse(userJson);

        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        try {
          const res = await fetch("http://localhost:5000/recommend/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ movies, comingSoonMovies }),
          });
          if (res.ok) {
            const data = await res.json();
            let parsed = [];
            try {
              if (data.recommended_movies) {
                parsed = data.recommended_movies;
              } else if (data.ai_output) {
                const ai = JSON.parse(data.ai_output);
                parsed = ai.recommendations || [];
              }
            } catch {}
            localStorage.setItem("recommendedMovies", JSON.stringify(parsed));
          } else {
            localStorage.setItem("recommendedMovies", JSON.stringify([]));
          }
        } catch {
          localStorage.setItem("recommendedMovies", JSON.stringify([]));
        }

        router.push("/now-showing");
      } catch {
        router.push("/login");
      }
    }

    handleLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-medium mb-4">ログイン中...</h1>
        <p className="text-gray-400">おすすめ映画を生成しています...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
