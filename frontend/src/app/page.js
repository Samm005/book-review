"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");

  const [token, setToken] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const loadData = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("query", search);
      }

      if (genre) {
        params.append("genre", genre);
      }

      if (sort) {
        params.append("sort", sort);
      }

      const url = `http://localhost:5000/api/books/search?${params.toString()}`;

      const response = await fetch(url);

      const data = await response.json();

      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error(err);
      setBooks([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFadeOut(false);
  }, [pathname]);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, genre, sort]);

  const smoothRedirect = (path) => {
    setFadeOut(true);

    setTimeout(() => {
      router.push(path);
    }, 400);
  };

  const handleBookClick = (book) => {
    if (!token) {
      smoothRedirect("/login");
      return;
    }

    if (book._id) {
      smoothRedirect(`/book/${book._id}`);
    } else {
      alert("External book - not in database");
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden text-white flex flex-col items-center px-4 py-10 bg-[#120a2a] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/50 rounded-full blur-[180px] top-[-250px] left-[-200px]" />
        <div className="absolute w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mb-6">
        <Navbar />
      </div>

      <div className="relative z-10 w-full max-w-6xl mb-10">
        <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-center hover:scale-105 transition">
          Popular Books
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mb-10 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search books or authors..."
          value={search}
          onFocus={() => {
            if (!token) smoothRedirect("/login");
          }}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-4 rounded-full bg-white/80 text-black focus:scale-[1.02] focus:ring-2 focus:ring-purple-400 transition"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-4 rounded-full bg-white/80 text-black"
        >
          <option value="">All Genres</option>
          <option value="fiction">Fiction</option>
          <option value="romance">Romance</option>
          <option value="fantasy">Fantasy</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="technology">Technology</option>
          <option value="self-help">Self Help</option>
          <option value="thriller">Thriller</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-4 rounded-full bg-white/80 text-black"
        >
          <option value="">Sort</option>
          <option value="rating">Highest Rated</option>
          <option value="az">A-Z</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, index) => (
          <div
            key={book._id || book.id || index}
            onClick={() => handleBookClick(book)}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl cursor-pointer transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            <img
              src={`https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w400&source=gbs_api`}
              alt={book.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-80 w-full object-cover rounded-xl bg-white/10"
            />

            <h2 className="mt-4 text-lg font-semibold line-clamp-2">
              {book.title}
            </h2>

            <p className="text-sm text-gray-300 mt-1 line-clamp-1">
              {book.author}
            </p>

            <div className="mt-3 text-base text-yellow-300">
              ⭐{" "}
              {book.rating || book.avgRating
                ? Number(book.rating || book.avgRating).toFixed(1)
                : "No ratings"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
