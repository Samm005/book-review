"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#120a2a] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-20 w-72 h-screen bg-[#2a1747] border-r border-white/10 p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-purple-300 tracking-wide mb-14">
          Admin Panel
        </h1>

        <div className="space-y-5">
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
            onClick={() => router.push("/")}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            🌐 View Website
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 ml-72 p-10 md:p-14">
        <div className="mb-14">
          <h1 className="text-6xl font-serif tracking-widest mb-4">
            Dashboard
          </h1>

          <p className="text-gray-300 text-lg">
            Manage books, reviews, and platform activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-xl">
                Total Books
              </h2>

              <span className="text-4xl">
                📚
              </span>
            </div>

            <p className="text-6xl font-bold text-purple-300">
              --
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(250,204,21,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-xl">
                Total Reviews
              </h2>

              <span className="text-4xl">
                ⭐
              </span>
            </div>

            <p className="text-6xl font-bold text-yellow-300">
              --
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 hover:shadow-[0_0_35px_rgba(248,113,113,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-300 text-xl">
                Pending Reviews
              </h2>

              <span className="text-4xl">
                ⏳
              </span>
            </div>

            <p className="text-6xl font-bold text-red-300">
              --
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}