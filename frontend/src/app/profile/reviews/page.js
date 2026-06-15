"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/profile/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#120a2a] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 lg:p-14">
        <button
          onClick={() => router.push("/profile")}
          className="mb-8 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl transition"
        >
          ← Back to Profile
        </button>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
          My Reviews
        </h1>

        <p className="text-gray-300 mb-10">
          Books you've reviewed.
        </p>

        {loading ? (
          <p className="text-xl text-gray-300">
            Loading reviews...
          </p>
        ) : reviews.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
            <p className="text-xl text-gray-300">
              You haven't reviewed any books yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                onClick={() =>
                  router.push(`/book/${review.book._id}`)
                }
                className="cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
              >
                <img
                  src={review.book?.coverImage}
                  alt={review.book?.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-purple-300 mb-2">
                    {review.book?.title}
                  </h2>

                  <p className="text-gray-400 text-sm mb-3">
                    {review.book?.author}
                  </p>

                  <p className="text-yellow-300 mb-3">
                    {"★".repeat(review.rating)}
                  </p>

                  <p className="text-gray-200 line-clamp-4 mb-4">
                    {review.review}
                  </p>

                  <p className="text-xs text-gray-400">
                    Reviewed on{" "}
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}