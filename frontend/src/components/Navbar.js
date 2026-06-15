"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

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
      setIsAdmin(payload.role === "admin");
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  useEffect(() => {
    loadUser();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <div className="flex justify-between items-center w-full relative z-[99999]">
      <h1
        onClick={() => router.push("/")}
        className="text-2xl font-bold cursor-pointer hover:scale-105 transition duration-300"
      >
        📚 BookHub
      </h1>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className="bg-purple-600/30 hover:bg-purple-600/50 px-5 py-2 rounded-xl transition-all duration-300 backdrop-blur-md border border-purple-400/20"
          >
            Admin Dashboard
          </button>
        )}

        <div ref={dropdownRef} className="relative z-[9999]">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition flex items-center gap-2"
          >
            <span>{user?.name || user?.email || "User"}</span>

            <span
              className={`transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2a1747] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[99999]">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition"
              >
                👤 Profile
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-500/20 transition"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
