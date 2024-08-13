const { defineAbilityFor } = require("../utils/abilities");
const { bookSchema } = require("../utils/validationSchemas");

const { Book, User, Rental } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const postBook = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  if (ability.cannot("create", "Book")) {
    return res.status(403).json({ error: "You are not allowed to post books" });
  }

  try {
    console.log("jbdsj dhbsh dkj", req.body)
    bookSchema.parse(req.body);
    const owner = await User.findByPk(req.user.id);

    if (!owner || !owner.isApproved) {
      return res
        .status(403)
        .json({ error: "You must be approved to post books" });
    }

    const existingBook = await Book.findOne({
      where: {
        title: req.body.title,
        author: req.body.author,
        ownerId: req.user.id,
      },
    });

    if (existingBook) {
      const updatedBook = await existingBook.update({
        ...req.body,
      });

      return res.status(200).json(updatedBook);
    } else {
      const newBook = await Book.create({
        ...req.body,
        ownerId: req.user.id,
        available: false,
      });

      return res.status(201).json(newBook);
    }
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

    bookSchema.pick({ available: true }).parse({ available });

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
      const rentedCount = book.rentals.filter(
        (rental) => rental.status === "rented"
      ).length;

      const isFree = book.quantity > rentedCount;

      const freeBookInfo = isFree
        ? {
            ...book.toJSON(),
            ownerName: book.owner ? book.owner.name : null,
            status: "free",
            availableCopies: book.quantity - rentedCount,
            rentedCount: rentedCount,
          }
        : null;

      const rentedBookInfo =
        rentedCount > 0
          ? {
              ...book.toJSON(),
              ownerName: book.owner ? book.owner.name : null,
              status: "rented",
              availableCopies: book.quantity - rentedCount,
              rentedCount: rentedCount,
            }
          : null;

      return { freeBookInfo, rentedBookInfo };
    });

    const allBooksWithStatus = booksWithStatus.flatMap(
      ({ freeBookInfo, rentedBookInfo }) => {
        return [freeBookInfo, rentedBookInfo].filter((info) => info !== null);
      }
    );

    res.status(200).json(allBooksWithStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBooks = async (req, res) => {
  const { title, author, category } = req.query;
  const userRole = req.user.role;

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
            required: false,
          },
        ],
      });
    } else if (userRole === "owner") {
      books = await Book.findAll({
        where: {
          ...where,
          ownerId: req.user.id,
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

const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        ownerId: req.user.id,
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

    const booksWithStatus = books.map((book) => {
      const rentedCount = book.rentals.filter(
        (rental) => rental.status === "rented"
      ).length;

      const isFree = book.quantity > rentedCount;

      const freeBookInfo = isFree
        ? {
            ...book.toJSON(),
            ownerName: book.owner ? book.owner.name : null,
            status: "free",
            availableCopies: book.quantity - rentedCount,
            rentedCount: rentedCount,
          }
        : null;

      const rentedBookInfo =
        rentedCount > 0
          ? {
              ...book.toJSON(),
              ownerName: book.owner ? book.owner.name : null,
              status: "rented",
              availableCopies: book.quantity - rentedCount,
              rentedCount: rentedCount,
            }
          : null;

      return { freeBookInfo, rentedBookInfo };
    });

    const allBooksWithStatus = booksWithStatus.flatMap(
      ({ freeBookInfo, rentedBookInfo }) => {
        return [freeBookInfo, rentedBookInfo].filter((info) => info !== null);
      }
    );

    res.status(200).json(allBooksWithStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


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
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = moment();
    const startOfMonth = currentDate.startOf("month").toDate();
    const endOfMonth = currentDate.endOf("month").toDate();
    const startOfWeek = currentDate.startOf("week").toDate();
    const endOfWeek = currentDate.endOf("week").toDate();
    const startOfDay = currentDate.startOf("day").toDate();
    const endOfDay = currentDate.endOf("day").toDate();

    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    const startOfLastWeek = moment()
      .subtract(1, "week")
      .startOf("week")
      .toDate();
    const endOfLastWeek = moment().subtract(1, "week").endOf("week").toDate();

    const startOfYesterday = moment()
      .subtract(1, "day")
      .startOf("day")
      .toDate();
    const endOfYesterday = moment().subtract(1, "day").endOf("day").toDate();

    console.log("Date Ranges:");
    console.log("Start of Month:", startOfMonth);
    console.log("End of Month:", endOfMonth);
    console.log("Start of Week:", startOfWeek);
    console.log("End of Week:", endOfWeek);
    console.log("Start of Day:", startOfDay);
    console.log("End of Day:", endOfDay);
    console.log("Start of Last Month:", startOfLastMonth);
    console.log("End of Last Month:", endOfLastMonth);
    console.log("Start of Last Week:", startOfLastWeek);
    console.log("End of Last Week:", endOfLastWeek);
    console.log("Start of Yesterday:", startOfYesterday);
    console.log("End of Yesterday:", endOfYesterday);

    // Find all book IDs owned by the user
    const booksOwned = await Book.findAll({
      where: {
        ownerId: userId,
      },
      attributes: ["id"], // Only select the book IDs
    });

    const bookIds = booksOwned.map((book) => book.id);

    // Fetch rentals for the current periods
    const currentMonthIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      })) || 0;

    const currentWeekIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfWeek,
            [Op.lte]: endOfWeek,
          },
        },
      })) || 0;

    const currentDayIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      })) || 0;

    // Fetch rentals for the previous periods
    const lastMonthIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfLastMonth,
            [Op.lte]: endOfLastMonth,
          },
        },
      })) || 0;

    const lastWeekIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfLastWeek,
            [Op.lte]: endOfLastWeek,
          },
        },
      })) || 0;

    const lastDayIncome =
      (await Rental.sum("amount", {
        where: {
          bookId: {
            [Op.in]: bookIds,
          },
          createdAt: {
            [Op.gte]: startOfYesterday,
            [Op.lte]: endOfYesterday,
          },
        },
      })) || 0;

    console.log("Income Data:");
    console.log("Current Month Income:", currentMonthIncome);
    console.log("Current Week Income:", currentWeekIncome);
    console.log("Current Day Income:", currentDayIncome);
    console.log("Last Month Income:", lastMonthIncome);
    console.log("Last Week Income:", lastWeekIncome);
    console.log("Last Day Income:", lastDayIncome);

    // Calculate percentage change
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    const monthPercentageChange = calculatePercentageChange(
      currentMonthIncome,
      lastMonthIncome
    );
    const weekPercentageChange = calculatePercentageChange(
      currentWeekIncome,
      lastWeekIncome
    );
    const dayPercentageChange = calculatePercentageChange(
      currentDayIncome,
      lastDayIncome
    );

    // Respond with the data
    res.json({
      walletBalance: user.walletBalance,
      currentMonthIncome,
      currentWeekIncome,
      currentDayIncome,
      monthPercentageChange,
      weekPercentageChange,
      dayPercentageChange,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const approveBookStatus = async (req, res) => {
  const ability = defineAbilityFor(req.user);

  try {
    bookSchema.pick({ available: true }).parse(req.body);
    const book = await Book.findByPk(req.params.id);

    if (ability.cannot("approve", book)) {
      return res
        .status(403)
        .json({ error: "You are not allowed to approve this book" });
    }

    await book.update({ available: req.body.available });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postBook,
  approveBook,
  getAvailableBooks,
  getBooks,
  getBooksByUser,
  createBook,
  updateBook,
  deleteBook,
  approveBookStatus,
  getWalletBalance
};
