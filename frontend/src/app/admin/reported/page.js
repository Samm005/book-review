"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportedReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/reviews/reported", {
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
    fetchReportedReviews();
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />
        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="lg:fixed left-0 top-0 z-20 w-full lg:w-72 lg:h-screen bg-[#2a1747] border-b lg:border-b-0 lg:border-r border-white/10 p-6 lg:p-8 shadow-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-8 lg:mb-14">
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-1 gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition text-lg"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => router.push("/admin/reviews")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition text-lg"
          >
            ⭐ Reviews
          </button>

          <button className="w-full text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600/40 to-fuchsia-500/30 text-lg">
            🚩 Reported
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition text-lg"
          >
            🌐 View Website
          </button>
        </div>
      </div>

      <div className="relative z-10 pt-[300px] sm:pt-[250px] lg:pt-10 lg:ml-72 p-6 md:p-10 lg:p-14">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-widest mb-4">
          Reported Reviews
        </h1>

        <p className="text-gray-300 mb-10 text-base md:text-lg">
          Reviews reported by users.
        </p>

        {loading ? (
          <p className="text-xl text-gray-300">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
            <p className="text-2xl text-gray-300">No reported reviews 🎉</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/10"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-2">
                      {review.book?.title || "Unknown Book"}
                    </h2>

                    <p className="text-gray-300 mb-1">
                      By: {review.user?.name || review.user?.email}
                    </p>

                    <p className="text-yellow-300 text-lg mb-4">
                      ⭐ {review.rating}/5
                    </p>

                    <p className="text-gray-200 leading-relaxed break-words mb-4">
                      {review.review}
                    </p>

                    <p className="text-red-300">
                      Reports: {review.reports?.length || 0}
                    </p>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-3 lg:w-[110px] shrink-0">
                    <button
                      onClick={() => approveReview(review._id)}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-semibold transition text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => deleteReview(review._id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold transition text-sm"
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
