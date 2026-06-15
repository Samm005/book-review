"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProfile(data.user);
        setReviewCount(data.reviewCount || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120a2a] text-white flex items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120a2a] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10 lg:p-14">
        <button
          onClick={() => router.push("/")}
          className="mb-8 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl transition"
        >
          ← Back to Home
        </button>

        <h1 className="text-5xl md:text-6xl font-serif mb-10">
          My Profile
        </h1>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Name</p>

              <h2 className="text-3xl font-bold text-purple-300">
                {profile?.name}
              </h2>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>

              <p className="text-xl">
                {profile?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Role</p>

              <p className="text-cyan-300 text-xl capitalize">
                {profile?.role}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Joined</p>

              <p className="text-xl">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push("/profile/reviews")}
          className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
        >
          <p className="text-gray-400 text-sm mb-2">
            Reviews Written
          </p>

          <h2 className="text-5xl font-bold text-yellow-300">
            {reviewCount}
          </h2>

          <p className="mt-3 text-gray-300">
            Click to view your reviews →
          </p>
        </div>
      </div>
    </div>
  );
}