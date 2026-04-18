"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser(payload);
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 Fix back button + tab switch
    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  // 🔥 Fix route navigation (very important)
  useEffect(() => {
    loadUser();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <div className="flex justify-between items-center w-full">
      {/* Logo */}
      <h1
        onClick={() => router.push("/")}
        className="text-2xl font-bold cursor-pointer hover:scale-105 transition"
      >
        📚 BookHub
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/80">
          {user?.name || user?.email || "User"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}