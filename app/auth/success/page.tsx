"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEncoded = searchParams.get("user");

    if (token && userEncoded) {
      try {
        // Base64デコード
        const userJson = atob(userEncoded);
        const user = JSON.parse(userJson);

        // トークンとユーザー情報をlocalStorageに保存
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        // ダッシュボードにリダイレクト
        router.push("/now-showing");
      } catch (error) {
        console.error("Failed to parse auth data:", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-medium mb-4">ログイン中...</h1>
        <p className="text-gray-400">お待ちください</p>
      </div>
    </div>
  );
}
