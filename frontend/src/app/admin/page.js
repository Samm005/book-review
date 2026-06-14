"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#120a2a] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="lg:fixed left-0 top-0 z-20 w-full lg:w-72 lg:h-screen bg-[#2a1747] border-b lg:border-b-0 lg:border-r border-white/10 p-6 lg:p-8 shadow-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-purple-300 tracking-wide mb-8 lg:mb-14">
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-1 gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600/40 to-fuchsia-500/30 hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => router.push("/admin/reviews")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            ⭐ Reviews
          </button>

          <button
            onClick={() => router.push("/admin/reported")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            🚩 Reported Reviews
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            🌐 View Website
          </button>
        </div>
      </div>

      <div className="relative z-10 pt-[300px] sm:pt-[260px] lg:pt-10 lg:ml-72 p-6 md:p-10 lg:p-14">
        <div className="mb-10 lg:mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-widest mb-4">
            Dashboard
          </h1>

          <p className="text-gray-300 text-base md:text-lg">
            Manage books, reviews, and platform activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-lg lg:text-xl">
                Imported Books
              </h2>

              <span className="text-3xl lg:text-4xl">📚</span>
            </div>

            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-300">
              {stats.totalBooks}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(250,204,21,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-lg lg:text-xl">
                Total Reviews
              </h2>

              <span className="text-3xl lg:text-4xl">⭐</span>
            </div>

            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300">
              {stats.totalReviews}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(34,211,238,0.35)] transition-all duration-300 md:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-lg lg:text-xl">
                Registered Users
              </h2>

              <span className="text-3xl lg:text-4xl">👥</span>
            </div>

            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-cyan-300">
              {stats.totalUsers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
