// Google OAuth コールバック処理ページ
// FastAPI バックエンドが認証後にここへリダイレクトする
// URL形式: /auth/success?token=<JWT>&user=<base64エンコードされたJSONユーザー情報>
//
// 処理フロー:
//   1. URLパラメータから token と user を取得
//   2. user を base64デコード → JSON.parse してユーザー情報を取得
//   3. localStorage に authToken と userInfo を保存
//   4. FastAPI の /recommend/movies エンドポイントに全映画データをPOSTしてAI推薦を取得
//   5. AI推薦結果を localStorage の recommendedMovies に保存
//   6. /now-showing へリダイレクト（失敗時は /login）

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { movies, comingSoonMovies } from "@/lib/mockData";

function AuthSuccessContent() {
  const router = useRouter();
  // useSearchParams は App Router では Suspense が必要（後述のSuspenseラッパー参照）
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleLogin() {
      const token = searchParams.get("token");
      const userEncoded = searchParams.get("user");

      // パラメータが欠けている場合はログインページへ戻す
      if (!token || !userEncoded) {
        router.push("/login");
        return;
      }

      try {
        // base64デコード後にJSONパース（FastAPIがbtoa(JSON.stringify(user))で生成したもの）
        const userJson = atob(userEncoded);
        const user = JSON.parse(userJson);

        // 認証情報を localStorage に永続化（Header.tsx と now-showing/page.tsx が参照する）
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        // AI映画推薦をリクエスト（失敗しても認証自体は成功扱いにする）
        try {
          const res = await fetch("http://localhost:5000/recommend/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            // 全映画リストをPOSTしてユーザーの好みに合わせたランキングを取得
            body: JSON.stringify({ movies, comingSoonMovies }),
          });
          if (res.ok) {
            const data = await res.json();
            let parsed = [];
            try {
              // FastAPIのレスポンス形式が2パターンある:
              // パターン1: { recommended_movies: [...] }
              // パターン2: { ai_output: "JSON文字列" } → パースして .recommendations を取得
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
          // ネットワークエラーや FastAPI 未起動時は空配列にフォールバック
          localStorage.setItem("recommendedMovies", JSON.stringify([]));
        }

        router.push("/now-showing");
      } catch {
        // base64デコード失敗やJSON不正などの場合はログインへ戻す
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

// useSearchParams() はクライアントサイドのサスペンスを引き起こすため
// Suspense でラップしないとビルドエラーになる（Next.js App Router の制約）
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
