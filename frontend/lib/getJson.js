"use client";

export default function TestSend() {
  async function sendData() {
    const res = await fetch("http://localhost:5000/recommend/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({}),  // 映画リストは Flask が DB から取得
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
