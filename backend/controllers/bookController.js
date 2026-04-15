import Book from "../models/Book.js";
import Review from "../models/Review.js";

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
            ? reviews.reduce((acc, r) => acc + r.rating, 0) /
              reviews.length
            : 0;

        return {
          ...book._doc,
          avgRating: avgRating.toFixed(1),
          totalReviews: reviews.length,
        };
      })
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
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    res.json({
      book,
      reviews,
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

    res.json({ message: "Book and related reviews deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};