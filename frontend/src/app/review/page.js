"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      fetchReviews();
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookTitle || !reviewText || rating === 0 || !author) {
      alert("Fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookTitle,
          review: reviewText,
          rating,
          author,
        }),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      fetchReviews();
      setBookTitle("");
      setAuthor("");
      setReviewText("");
      setRating(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col items-center px-4 py-8 bg-[#120a2a]">

      <div className="absolute inset-0 pointer-events-none">

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="glow1" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#120a2a" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="glow2" cx="70%" cy="70%" r="60%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#120a2a" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b1d73" />
              <stop offset="50%" stopColor="#5b21b6" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="#120a2a" />

          <rect width="100%" height="100%" fill="url(#glow1)" />
          <rect width="100%" height="100%" fill="url(#glow2)" />

          <path
            d="M0,200 C300,100 600,300 900,200 C1200,100 1400,250 1440,300 L1440,800 L0,800 Z"
            fill="url(#waveGrad)"
            opacity="0.9"
          />

          <path
            d="M0,350 C300,250 700,450 1100,300 C1300,230 1400,350 1440,380 L1440,800 L0,800 Z"
            fill="#6d28d9"
            opacity="0.4"
          />
        </svg>

      </div>

      <div className="relative z-10 w-full max-w-5xl flex justify-between items-center mb-10">
        <h1 className="text-5xl font-serif tracking-widest opacity-90">
          book review
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 transition duration-500 hover:scale-[1.01]"
      >

        <div className="space-y-6">

          <input
            placeholder="title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="w-full p-4 rounded-full bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            placeholder="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-4 rounded-full bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <textarea
            placeholder="my thoughts..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-52 p-4 rounded-2xl bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

        </div>

        <div className="flex flex-col justify-between items-center space-y-10">

          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-lg tracking-wide opacity-80">rating</p>

            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  className={`cursor-pointer text-4xl transition transform hover:scale-125 ${
                    num <= rating ? "text-yellow-300" : "text-white/40"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 py-4 rounded-full text-white font-semibold hover:scale-[1.05] active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Review"}
          </button>

        </div>

      </form>

      <div className="relative z-10 w-full max-w-4xl mt-14 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-white/70 animate-pulse">
            No reviews yet
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold">{r.bookTitle}</h2>
              <p className="text-white/70 mt-1">by {r.author || "Unknown"}</p>
              <p className="mt-3">{r.review}</p>

              <div className="flex mt-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-300">★</span>
                ))}
              </div>

              <p className="text-sm text-white/60 mt-2">
                By {r.user?.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}