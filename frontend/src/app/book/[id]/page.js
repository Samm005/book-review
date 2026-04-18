"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const MIN_REVIEW_LENGTH = 10;

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const [popup, setPopup] = useState("");

  const [editPopup, setEditPopup] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadData = async () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUserId(payload.id);
    }

    const res = await fetch(`http://localhost:5000/api/books/${id}`);
    const data = await res.json();

    setBook(data.book);
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
    setTotalReviews(data.totalReviews);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // ✅ Popup auto-hide
  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  // VALIDATION
  const validateReview = (text, ratingVal) => {
    const trimmed = text.trim();
    if (!trimmed) return "Review cannot be empty";
    if (trimmed.length < MIN_REVIEW_LENGTH)
      return `Review must be at least ${MIN_REVIEW_LENGTH} characters`;
    if (ratingVal === 0) return "Please select a rating";
    return null;
  };

  // ADD REVIEW
  const submitReview = async () => {
    const error = validateReview(reviewText, rating);
    if (error) return setPopup(error);

    await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId: id,
        review: reviewText.trim(),
        rating,
      }),
    });

    setReviewText("");
    setRating(0);
    loadData();
  };

  // EDIT REVIEW
  const handleEditSave = async () => {
    const error = validateReview(editText, editRating);
    if (error) return setPopup(error);

    await fetch(`http://localhost:5000/api/reviews/${editPopup}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review: editText.trim(),
        rating: editRating,
      }),
    });

    setEditPopup(null);
    loadData();
  };

  // DELETE REVIEW
  const deleteReview = async (id) => {
    await fetch(`http://localhost:5000/api/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setConfirmDelete(null);
    loadData();
  };

  if (!book) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen relative overflow-hidden text-white px-4 py-10 bg-[#120a2a]">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/50 rounded-full blur-[180px] top-[-250px] left-[-200px]" />
        <div className="absolute w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <div className="max-w-6xl mx-auto mb-6">
          <Navbar />
        </div>

        {/* Back Button */}
        <div className="max-w-6xl mx-auto mb-4">
          <button
            onClick={() => router.push("/")}
            className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md hover:bg-white/20 hover:scale-105 transition"
          >
            ← Back to Books
          </button>
        </div>

        {/* Book Box */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-center transition hover:scale-[1.01]">
            <img
              src={book.coverImage}
              className="w-60 mx-auto mb-6 rounded-xl shadow-2xl hover:scale-105 transition duration-300"
            />
            <h1 className="text-4xl font-bold">{book.title}</h1>
            <p className="text-gray-300">{book.author}</p>
            <p className="mt-4">{book.description}</p>
            <div className="mt-4 text-yellow-400">
              ⭐ {avgRating} ({totalReviews} reviews)
            </div>
          </div>
        </div>

        {/* Add Review */}
        {token && (
          <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-xl mb-10 backdrop-blur-md shadow-lg">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-4 rounded text-black mb-4 focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
            />

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-3xl cursor-pointer hover:scale-125 transition ${
                    rating >= n ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={submitReview}
                className="bg-purple-500 px-6 py-2 rounded hover:bg-purple-600 hover:scale-105 transition"
              >
                Add Review
              </button>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="max-w-4xl mx-auto space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-md hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition duration-300"
            >
              <p className="font-semibold">{r.user?.name}</p>
              <div className="text-yellow-400">{"★".repeat(r.rating)}</div>
              <p>{r.review}</p>

              {r.user?._id === userId && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => {
                      setEditPopup(r._id);
                      setEditText(r.review);
                      setEditRating(r.rating);
                    }}
                    className="text-blue-400 hover:underline hover:scale-105 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(r._id)}
                    className="text-red-400 hover:underline hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* EDIT POPUP */}
        {editPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md animate-scaleIn">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 rounded text-black mb-4"
              />

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    onClick={() => setEditRating(n)}
                    className={`text-2xl cursor-pointer hover:scale-125 transition ${
                      editRating >= n ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={() => setEditPopup(null)}>Cancel</button>
                <button onClick={handleEditSave}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE POPUP */}
        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md animate-scaleIn text-center">
              <p className="mb-4">Delete this review?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button
                  onClick={() => deleteReview(confirmDelete)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP */}
        {popup && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-purple-600 px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
            {popup}
          </div>
        )}
      </div>

      {/* 🔥 ANIMATIONS */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
