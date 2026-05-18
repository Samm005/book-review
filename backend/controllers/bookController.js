// backend/controllers/bookController.js

import Book from "../models/Book.js";
import Review from "../models/Review.js";
import axios from "axios";

export const addBook = async (req, res) => {
  try {
    const { title, author, description, coverImage } = req.body;

    const book = new Book({
      title,
      author,
      description,
      coverImage,
    });

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({
          book: book._id,
          status: "approved",
        });

        const avgRating =
          reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        return {
          ...book._doc,
          avgRating: avgRating.toFixed(1),
          totalReviews: reviews.length,
        };
      }),
    );

    res.json(booksWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = await Review.find({
      book: book._id,
      status: "approved",
    }).populate("user", "name");

    const totalReviews = reviews.length;

    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          ).toFixed(1)
        : 0;

    let userId = null;

    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );

        userId = decoded.id;
      } catch {}
    }

    let userReview = null;

    if (userId) {
      userReview = reviews.find((r) => r.user._id.toString() === userId);
    }

    const sortedReviews = userReview
      ? [
          userReview,
          ...reviews.filter(
            (r) => r._id.toString() !== userReview._id.toString(),
          ),
        ]
      : reviews;

    res.json({
      book,
      reviews: sortedReviews,
      userReview,
      avgRating,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, author, description, coverImage } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Review.deleteMany({ book: book._id });

    await book.deleteOne();

    res.json({
      message: "Book and related reviews deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query = "", genre = "", sort = "" } = req.query;

    let apiQuery = "";

    if (query.trim()) {
      apiQuery += query;
    } else {
      apiQuery += "subject:fiction";
    }

    if (genre.trim()) {
      apiQuery += `+subject:${genre}`;
    }

    let orderBy = "relevance";

    if (sort === "newest") {
      orderBy = "newest";
    }

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${apiQuery}&maxResults=15&orderBy=${orderBy}&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
    );
    const data = response.data;

    if (!data.items) {
      return res.json([]);
    }

    let books = data.items.map((item) => {
      const googleId = item.id;

      // Stable Google Books cover URL
      const coverImage = `https://books.google.com/books/content?id=${googleId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;

      return {
        id: googleId,

        title: item.volumeInfo.title || "Unknown",

        author: item.volumeInfo.authors?.join(", ") || "Unknown",

        description: item.volumeInfo.description || "",

        coverImage,

        publishedDate: item.volumeInfo.publishedDate || "",

        rating: item.volumeInfo.averageRating || 0,
      };
    });

    if (sort === "az") {
      books.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "rating") {
      books.sort((a, b) => b.rating - a.rating);
    }

    res.json(books);
  } catch (error) {
    console.error("Search error:", error.message);

    res.status(500).json({
      message: "Search failed",
    });
  }
};
