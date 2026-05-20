"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUser = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser(payload);

      if (payload.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Fix back button + tab switch
    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  // Fix route navigation
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
        className="text-2xl font-bold cursor-pointer hover:scale-105 transition duration-300"
      >
        📚 BookHub
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Admin Button */}
        {isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className="bg-purple-600/30 hover:bg-purple-600/50 px-5 py-2 rounded-xl transition-all duration-300 backdrop-blur-md border border-purple-400/20"
          >
            Admin Dashboard
          </button>
        )}

        {/* User Name */}
        <span className="text-sm text-white/80">
          {user?.name || user?.email || "User"}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
