"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ Load data (books + token)
  const loadData = () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  };

  // ✅ Initial load + focus reload (fix back button)
  useEffect(() => {
    loadData();

    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // 🔥 CRITICAL FIX: reset fade when coming back
  useEffect(() => {
    setFadeOut(false);
  }, [pathname]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Smooth transition
  const smoothRedirect = (path) => {
    setFadeOut(true);

    setTimeout(() => {
      router.push(path);
    }, 400);
  };

  const handleBookClick = (id) => {
    if (!token) {
      smoothRedirect("/login");
    } else {
      smoothRedirect(`/book/${id}`);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden text-white flex flex-col items-center px-4 py-10 bg-[#120a2a] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/50 rounded-full blur-[180px] top-[-250px] left-[-200px]" />
        <div className="absolute w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* Navbar */}
      <div className="relative z-10 w-full max-w-6xl mb-6">
        <Navbar />
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-6xl mb-10">
        <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-center hover:scale-105 transition">
          Popular Books
        </h1>
      </div>

      {/* Search */}
      <div className="relative z-10 w-full max-w-4xl mb-10">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onFocus={() => {
            if (!token) smoothRedirect("/login");
          }}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-full bg-white/80 text-black focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>

      {/* Books Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            onClick={() => handleBookClick(book._id)}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl cursor-pointer transition duration-300 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-52 w-full object-cover rounded-lg"
            />

            <h2 className="mt-3 font-semibold text-lg">
              {book.title}
            </h2>

            <p className="text-sm text-white/70">
              {book.author}
            </p>

            <div className="mt-2 text-sm text-yellow-300">
              ⭐ {book.avgRating} | {book.totalReviews} reviews
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}