"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch("http://localhost:5000/api/reviews");
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookTitle || !reviewText || rating === 0) {
      alert("Fill all fields + rating");
      return;
    }

    const token = localStorage.getItem("token");

    setLoading(true);

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
      }),
    });

    setLoading(false);

    if (res.status === 401) {
      alert("Login required");
      return;
    }

    fetchReviews();
    setBookTitle("");
    setReviewText("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center p-6">

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 tracking-wide hover:scale-105 transition">
        📚 Book Reviews
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-900/80 backdrop-blur p-6 rounded-xl shadow-lg space-y-4 transition hover:shadow-2xl hover:scale-[1.01]"
      >
        <input
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        {/* ⭐ STAR RATING */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setRating(num)}
              className={`cursor-pointer text-3xl transition transform hover:scale-125 ${
                num <= rating ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="bg-blue-500 px-5 py-2 rounded hover:bg-blue-600 transition transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Review"}
        </button>
      </form>

      {/* REVIEWS */}
      <div className="w-full max-w-2xl mt-10 space-y-5">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center animate-pulse">
            No reviews yet
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="border border-gray-700 p-5 rounded-lg bg-gray-900 shadow transition transform hover:scale-[1.02] hover:shadow-xl"
            >
              <h2 className="text-lg font-semibold">{r.bookTitle}</h2>
              <p className="mt-2 text-gray-300">{r.review}</p>

              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span
                    key={i}
                    className="text-yellow-400 animate-pulse"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-400 mt-2">
                By {r.user?.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}