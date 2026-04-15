"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    let newErrors = { ...errors };

    if (
      updated.confirmPassword &&
      updated.password !== updated.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      delete newErrors.confirmPassword;
    }

    if (
      updated.password &&
      !validatePassword(updated.password)
    ) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & special char";
    } else {
      delete newErrors.password;
    }

    delete newErrors.api;

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!form.name || !form.email || !form.password) {
      setErrors({ api: "All fields are required" });
      return;
    }

    if (!validatePassword(form.password)) {
      setErrors({
        password:
          "Password must be 8+ chars with uppercase, lowercase, number & special char",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message });
        return;
      }

      router.replace("/login");
    } catch (err) {
      setErrors({ api: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] px-4">

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">

        <div className="p-8 text-white">

          <h2 className="text-3xl font-bold text-center mb-6">
            Sign up
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="User name"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div className="relative">
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black pr-10"
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
              {errors.api && errors.api}
              {!errors.api && errors.confirmPassword && errors.confirmPassword}
              {!errors.api && !errors.confirmPassword && errors.password && errors.password}
            </p>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>

          </form>
        </div>

        <div className="bg-white text-center py-6 rounded-t-[70%] -mt-3">
          <button
            onClick={() => router.push("/login")}
            className="text-purple-700 font-semibold hover:underline"
          >
            Already have an account? Login
          </button>
        </div>

      </div>
    </div>
  );
}