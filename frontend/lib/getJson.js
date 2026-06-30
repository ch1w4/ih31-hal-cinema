"use client";

import { movies, comingSoonMovies } from "@/lib/mockData";

export default function TestSend() {
  async function sendData() {
    const res = await fetch("http://localhost:5000/recommend/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movies,
        comingSoonMovies
      })
    });

    const json = await res.json();
    console.log("AIの返答:", json);
  }

  return (
    <button onClick={sendData}>
      映画推薦を試す
    </button>
  );
}
