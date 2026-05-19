"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { movies, comingSoonMovies } from "@/lib/mockData";

export default function AuthSuccessPage() {
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
        // Base64デコード
        const userJson = atob(userEncoded);
        const user = JSON.parse(userJson);

        // トークンとユーザー情報をlocalStorageに保存
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        // 🔥 映画推薦APIを叩く
        try {
          const res = await fetch("http://localhost:5000/recommend/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",  // セッション情報を送信
            body: JSON.stringify({
              movies,
              comingSoonMovies
            })
          });

          if (res.ok) {
            const data = await res.json();
            // 推薦映画を保存
            console.log("Recommended movies:", data);
            localStorage.setItem("recommendedMovies", JSON.stringify(data.recommended_movies || []));
          } else {
            console.warn("Recommendation API returned:", res.status);
            localStorage.setItem("recommendedMovies", JSON.stringify([]));
          }
        } catch (fetchError) {
          console.warn("Failed to fetch recommendations:", fetchError);
          // APIが失敗してもログイン処理は続ける
          localStorage.setItem("recommendedMovies", JSON.stringify([]));
        }

        // now-showing に遷移
        router.push("/now-showing");

      } catch (error) {
        console.error("Failed to parse auth data:", error);
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
