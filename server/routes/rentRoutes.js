const express = require("express");
const { rentBook } = require("../controllers/rentalController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authActionMiddleware");

const router = express.Router();

router.post("/rent-book/:bookId", authMiddleware, authorize("rent", "Book"), rentBook);
module.exports = router;
