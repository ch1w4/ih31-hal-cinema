"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { fetchMyBookings, MyBooking } from "@/lib/api";

export default function ReservationsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) {
      router.push("/login");
      return;
    }
    let email = "";
    try {
      email = (JSON.parse(userInfoStr) as { email?: string }).email ?? "";
    } catch {}
    if (!email) {
      router.push("/login");
      return;
    }
    fetchMyBookings(email).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [router]);

  // "YYYY-MM-DD" → "YYYY/MM/DD"
  function fmtDate(iso: string): string {
    return iso.replace(/-/g, "/");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-white text-lg font-bold mb-6">予約済み座席</h1>

        {loading ? (
          <div className="text-gray-400 text-sm animate-pulse">読み込み中...</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-500 text-sm">予約はありません</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.bookingNo}
                className={`border border-[#333] rounded-lg p-4 bg-[#1a1a1a] transition-all ${
                  b.isPast ? "grayscale opacity-50" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* ポスター */}
                  <div
                    className="flex-shrink-0 rounded overflow-hidden"
                    style={{ width: "48px", aspectRatio: "2/3" }}
                  >
                    {b.moviePoster ? (
                      <img
                        src={b.moviePoster}
                        alt={b.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(160deg, ${b.posterColor} 0%, #111 100%)`,
                        }}
                      />
                    )}
                  </div>

                  {/* 予約情報 */}
                  <div className="flex-1 space-y-1 text-sm min-w-0">
                    <div className="text-white font-medium truncate">{b.movieTitle}</div>
                    <div className="text-gray-400">
                      {fmtDate(b.showDate)}　{b.startTime}　{b.screenName}
                    </div>
                    <div className="text-gray-400">座席：{b.seats.join(", ")}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">予約番号：{b.bookingNo}</span>
                      <span className="text-gray-300">¥{b.totalPrice.toLocaleString()}</span>
                    </div>
                    {b.isPast && (
                      <div className="text-gray-600 text-xs">上映済み</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
