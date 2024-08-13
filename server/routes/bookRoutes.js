const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  postBook,
  getAvailableBooks,
  approveBook,
  getBooksByUser,
  getWalletBalance,
} = require("../controllers/bookController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authActionMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBooks);
router.get("/available-books", authMiddleware, getAvailableBooks);
router.get("/by-user", authMiddleware, getBooksByUser);
router.get("/wallet-balance/:userId", getWalletBalance);
// router.post("/", authMiddleware, createBook);
router.post("/",authMiddleware, authorize("create", "Book"),postBook);
router.put("/approve-book/:bookId",authMiddleware, authorize("manage", "all"),approveBook);
router.put("/:id", authMiddleware, authorize("update", "Book"), updateBook);
router.delete("/:id", authMiddleware, authorize("delete", "Book"), deleteBook);

module.exports = router;
