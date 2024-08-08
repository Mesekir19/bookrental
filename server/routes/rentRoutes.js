const express = require("express");
const { rentBook } = require("../controllers/rentalController");

const router = express.Router();

router.post("/rent-book/:bookId", rentBook);
module.exports = router;
