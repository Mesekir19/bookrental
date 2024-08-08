const { Rental, Book, User } = require("../models");

const rentBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ error: "No copies available for rent" });
    }

    const rental = await Rental.create({
      userId: req.user.id,
      bookId,
      status: "rented",
    });

    // Update book quantity
    book.quantity -= 1;
    await book.save();

    // Update owner's wallet
    const owner = await User.findByPk(book.ownerId);
    if (owner) {
      owner.walletBalance += book.rentPrice;
      await owner.save();
    }

    res.status(201).json(rental);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { rentBook };
