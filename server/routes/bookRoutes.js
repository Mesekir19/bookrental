const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  postBook,
  getAvailableBooks,
  approveBook,
} = require("../controllers/bookController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBooks);
router.get("/available-books", authMiddleware, getAvailableBooks);
// router.post("/", authMiddleware, createBook);
router.post("/",authMiddleware, postBook);
router.put("/approve-book/:bookId",authMiddleware, approveBook);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
