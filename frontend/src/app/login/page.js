"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      router.replace("/review"); 
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] px-4">

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">

        <div className="p-8 text-white">

          <h2 className="text-3xl font-bold text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <p className="text-red-400 text-sm min-h-[20px]">
              {error}
            </p>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>

        <div className="bg-white text-center py-6 rounded-t-[70%] -mt-3">
          <button
            onClick={() => router.push("/register")}
            className="text-purple-700 font-semibold hover:underline"
          >
            No account? Register
          </button>
        </div>

      </div>
    </div>
  );
}