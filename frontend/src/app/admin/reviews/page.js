"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/reviews/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/reviews/approve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/reviews/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#120a2a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-20 w-72 h-screen bg-[#2a1747] border-r border-white/10 p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-purple-300 mb-14">
          Admin Panel
        </h1>

        <div className="space-y-5">
          <button
            onClick={() => router.push("/admin")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition text-lg"
          >
            📊 Dashboard
          </button>

          <button className="w-full text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600/40 to-fuchsia-500/30 text-lg">
            ⭐ Reviews
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition text-lg"
          >
            🌐 View Website
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 ml-72 p-10 md:p-14">
        <h1 className="text-6xl font-serif tracking-widest mb-4">
          Pending Reviews
        </h1>

        <p className="text-gray-300 mb-10 text-lg">
          Moderate and manage submitted reviews.
        </p>

        {loading ? (
          <p className="text-xl text-gray-300">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
            <p className="text-2xl text-gray-300">No pending reviews 🎉</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10"
              >
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-purple-300 mb-2">
                      {review.book?.title || "Unknown Book"}
                    </h2>

                    <p className="text-gray-300 mb-1">
                      By: {review.user?.name || review.user?.email}
                    </p>

                    <p className="text-yellow-300 text-lg mb-4">
                      ⭐ {review.rating}/5
                    </p>

                    <p className="text-gray-200 leading-relaxed">
                      {review.review}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 min-w-[150px]">
                    <button
                      onClick={() => approveReview(review._id)}
                      className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl font-semibold transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => deleteReview(review._id)}
                      className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}