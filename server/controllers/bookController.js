const { defineAbilityFor } = require("../utils/abilities");
const { bookSchema } = require("../utils/validationSchemas");

const { Book, User, Rental } = require("../models");
const { Op } = require("sequelize");

const postBook = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  // Check if the user has permission to create books
  if (ability.cannot("create", "Book")) {
    return res.status(403).json({ error: "You are not allowed to post books" });
  }

  try {
    // Fetch the owner from the database
    const owner = await User.findByPk(req.user.id);

    // Ensure the user is approved before posting the book
    if (!owner || !owner.isApproved) {
      return res
        .status(403)
        .json({ error: "You must be approved to post books" });
    }

    // Create the book with initial status as not available
    const book = await Book.create({
      ...req.body,
      ownerId: req.user.id,
      available: false, // Initially not available until approved by admin
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveBook = async (req, res) => {
  const { bookId } = req.params;
  const { available } = req.body;

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // book.available = true;
    book.available = available;

    await book.save();

    res.status(200).json({ message: "Book approved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { available: true },
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "owner",
        },
        {
          model: Rental,
          attributes: ["status"],
          as: "rentals",
          required: false,
        },
      ],
    });

    const booksWithStatus = books.map((book) => {
      const rentalStatus =
        book.rentals && book.rentals.length > 0
          ? book.rentals[0].status
          : "free";

      return {
        ...book.toJSON(),
        ownerName: book.owner ? book.owner.name : null,
        status: rentalStatus === "rented" ? "rented" : "free",
      };
    });

    res.status(200).json(booksWithStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBooks = async (req, res) => {
  const { title, author, category } = req.query;
  const userRole = req.user.role; // Assuming `role` is a property of `req.user`

  const where = {};
  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (author) where.author = { [Op.iLike]: `%${author}%` };
  if (category) where.category = category;

  try {
    let books;

    if (userRole === "admin") {
      books = await Book.findAll({
        where,
        include: [
          {
            model: User,
            attributes: ["name"],
            as: "owner",
          },
          {
            model: Rental,
            attributes: ["status"],
            as: "rentals",
            required: false, // Include books even if they have no rentals
          },
        ],
      });
    } else if (userRole === "owner") {
      books = await Book.findAll({
        where: {
          ...where,
          ownerId: req.user.id, // Filter to only books owned by the user
        },
        include: [
          {
            model: User,
            attributes: ["name"],
            as: "owner",
          },
          {
            model: Rental,
            attributes: ["status"],
            as: "rentals",
            required: false,
          },
        ],
      });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    // Map over books to include owner name and rental status
    const booksWithStatus = books.map((book) => {
      // Assuming that there might be multiple rentals, use the first rental status or default to "free"
      const rentalStatus =
        book.rentals && book.rentals.length > 0
          ? book.rentals[0].status
          : "free";

      return {
        ...book.toJSON(),
        ownerName: book.owner ? book.owner.name : null,
        status: rentalStatus === "rented" ? "rented" : "free",
      };
    });

    res.status(200).json(booksWithStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const getBooks = async (req, res) => {
//   const { title, author, category } = req.query;

//   const where = {};
//   if (title) where.title = { [Op.iLike]: `%${title}%` };
//   if (author) where.author = { [Op.iLike]: `%${author}%` };
//   if (category) where.category = category;

//   try {
//     const books = await Book.findAll({
//       where,
//       include: [
//         {
//           model: User,
//           attributes: ["name"], // Adjust based on the User model's attribute for the name
//           as: "owner", // Ensure this matches the alias used in your association
//         },
//       ],
//     });

//     // Map over books to include owner name
//     const booksWithOwner = books.map((book) => ({
//       ...book.toJSON(),
//       ownerName: book.owner ? book.owner.name : null,
//     }));

//     res.status(200).json(booksWithOwner);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
const createBook = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  if (ability.cannot("create", "Book")) {
    return res
      .status(403)
      .json({ error: "You are not allowed to create books" });
  }

  try {
    bookSchema.parse(req.body);
    const book = await Book.create({
      ...req.body,
      ownerId: req.user.id,
      available: true,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  try {
    bookSchema.parse(req.body);
    const book = await Book.findByPk(req.params.id);

    if (ability.cannot("update", book)) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this book" });
    }

    await book.update(req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteBook = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  try {
    const book = await Book.findByPk(req.params.id);

    if (ability.cannot("delete", book)) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this book" });
    }

    await book.destroy();
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  approveBook,
  postBook,
  getAvailableBooks,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
