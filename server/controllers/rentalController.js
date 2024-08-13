const { Rental, Book, User } = require("../models");

const rentBook = async (req, res) => {
  const bookId = req.params.bookId;

  try {
    // Find the book to rent
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ error: "No copies available for rent" });
    }

    // Create a rental record with the rentPrice
    const rental = await Rental.create({
      userId: req.user.id,
      bookId,
      status: "rented",
      amount: book.rentPrice, 
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

const returnBook = async (req, res) => {
  const rentalId = req.params.rentalId;

  try {
    // Find the rental record
    const rental = await Rental.findByPk(rentalId, {
      include: [Book],
    });

    if (!rental) {
      return res.status(404).json({ error: "Rental record not found" });
    }

    if (rental.status !== "rented") {
      return res.status(400).json({ error: "Book is not currently rented" });
    }

    // Update the rental status to "returned"
    rental.status = "returned";
    await rental.save();

    // Update book quantity
    const book = rental.Book;
    book.quantity += 1;
    await book.save();

    res.status(200).json({ message: "Book returned successfully", rental });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { rentBook, returnBook };
