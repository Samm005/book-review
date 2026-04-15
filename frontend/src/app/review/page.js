"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserId(payload.id);

    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await fetch("http://localhost:5000/api/reviews");
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setLoading(true);

    await fetch("http://localhost:5000/api/reviews", {
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

    setLoading(false);

    fetchReviews();
    setBookTitle("");
    setAuthor("");
    setReviewText("");
    setRating(0);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/reviews/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDeleteId(null);
    fetchReviews();
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/reviews/${editingReview._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingReview),
    });

    setEditingReview(null);
    fetchReviews();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col items-center px-4 py-10 bg-[#120a2a]">
      <div className="absolute inset-0">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/50 rounded-full blur-[180px] top-[-250px] left-[-200px]" />
        <div className="absolute w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex justify-between items-center mb-12">
        <h1 className="text-5xl font-serif tracking-widest hover:scale-105 transition duration-300">
          book review
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-2xl rounded-3xl p-8 grid md:grid-cols-2 gap-8 shadow-2xl transition duration-500 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
      >
        <div className="space-y-6">
          <input
            placeholder="title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="w-full p-4 rounded-full bg-white/80 text-black focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            placeholder="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-4 rounded-full bg-white/80 text-black focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
          />

          <textarea
            placeholder="my thoughts..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-40 p-4 rounded-2xl bg-white/80 text-black focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
          />
        </div>

        <div className="flex flex-col justify-between items-center">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setRating(n)}
                className={`text-4xl cursor-pointer transition transform hover:scale-125 ${
                  n <= rating
                    ? "text-yellow-300 drop-shadow-lg"
                    : "text-white/40"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-3 rounded-full hover:scale-105 active:scale-95 transition duration-300 shadow-lg">
            {loading ? "Adding..." : "Add Review"}
          </button>
        </div>
      </form>

      <div className="relative z-10 w-full max-w-4xl mt-12 space-y-6">
        {reviews.map((r) => {
          const isOwner = r.user?._id === userId;

          return (
            <div
              key={r._id}
              className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl transition duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              <h2 className="text-xl font-semibold">{r.bookTitle}</h2>
              <p className="text-sm text-white/70">by {r.author}</p>
              <p className="mt-2">{r.review}</p>

              <div className="flex mt-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-300">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm text-white/60 mt-2">By {r.user?.name}</p>

              {isOwner && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setEditingReview(r)}
                    className="bg-yellow-500 px-4 py-1 rounded hover:scale-105 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(r._id)}
                    className="bg-red-500 px-4 py-1 rounded hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl space-y-4 shadow-2xl">
            <p className="text-white text-lg text-center">
              Delete this review?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDelete}
                className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition"
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 rounded-lg border border-white/30 hover:bg-white/10 hover:scale-105 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl space-y-5 shadow-2xl w-[90%] max-w-md">
            <div className="text-left">
              <h2 className="text-lg font-semibold">
                {editingReview.bookTitle}
              </h2>
              <p className="text-sm text-white/70">by {editingReview.author}</p>
            </div>

            <textarea
              value={editingReview.review}
              onChange={(e) =>
                setEditingReview({
                  ...editingReview,
                  review: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-white/80 text-black"
            />

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() =>
                    setEditingReview({ ...editingReview, rating: n })
                  }
                  className={`text-3xl cursor-pointer transition hover:scale-125 ${
                    n <= editingReview.rating
                      ? "text-yellow-300"
                      : "text-white/40"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleUpdate}
                className="bg-purple-600 px-5 py-2 rounded-lg hover:scale-105 transition"
              >
                Update
              </button>

              <button
                onClick={() => setEditingReview(null)}
                className="px-5 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
