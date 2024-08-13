import * as React from "react";
import {
  Box,
  Button,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Grid,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/Context/UserContext";
import axios from "axios";

export default function UploadNewBook() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useContext(UserContext);

  const [openAddBook, setOpenAddBook] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);
  const [rentPrice, setRentPrice] = useState(0);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddBookOpen = () => setOpenAddBook(true);
  const handleAddBookClose = () => setOpenAddBook(false);
  const handleSuccessOpen = () => setOpenSuccess(true);
  const handleSuccessClose = () => setOpenSuccess(false);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/books/by-user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBooks(response.data);

        const bookId = searchParams.get("bookName");
        const authorNameParam = searchParams.get("authorName");
        const categoryParam = searchParams.get("category");
        const bookQuantityParam = searchParams.get("bookQuantity");
        const rentPriceParam = searchParams.get("rentPrice");

        if (bookId && authorNameParam && categoryParam) {
          setBookName(bookId);
          setAuthorName(authorNameParam);
          setCategory(categoryParam);
          setBookQuantity(bookQuantityParam || 0);
          setRentPrice(rentPriceParam || 0);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    fetchBooks();
  }, [searchParams]);

  const handleBookSelect = (event, value) => {
    if (value === "Add Book") {
      setBookName("");
      setAuthorName("");
      setCategory("");
      setBookQuantity(0);
      setRentPrice(0);
      handleAddBookOpen();
    } else {
      const selected = books.find((book) => book.title === value);
      if (selected) {
        setBookName(selected.title);
        setAuthorName(selected.author);
        setCategory(selected.category);
        setBookQuantity(selected.quantity || 0); // Assuming quantity is available
        setRentPrice(selected.rentPrice || 0); // Assuming rentPrice is available
        handleAddBookOpen();
      }
    }
  };

  const handleSubmit = async () => {
    if (!bookName || !authorName || !category || !bookQuantity || !rentPrice) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = {
        title: bookName,
        author: authorName,
        category,
        quantity: bookQuantity,
        rentPrice,
        ownerId: userId,
      };

      const response = await axios.post(
        "http://localhost:5000/api/books",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response:", response.data);
      handleSuccessOpen();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Paper
      sx={{
        p: 1,
        ml: 1,
        height: "84.5vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mr: -1,
      }}
    >
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Upload New Book
      </Typography>
      <Box sx={{ p: 3, width: "600px" }}>
        <FormControl
          variant="filled"
          sx={{ mb: 2, width: "50%", marginX: "25%" }}
        >
          <Autocomplete
            value={bookName}
            onChange={handleBookSelect}
            options={books.map((book) => book.title).concat(["Add Book"])}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search book by name or Author"
                variant="filled"
              />
            )}
          />
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Book Quantity"
              variant="outlined"
              type="number"
              value={bookQuantity}
              onChange={(e) => setBookQuantity(parseInt(e.target.value, 10))}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Rent price for 2 weeks"
              variant="outlined"
              type="number"
              value={rentPrice}
              onChange={(e) => setRentPrice(parseInt(e.target.value, 10))}
              required
            />
          </Grid>
        </Grid>

        <Button
          fullWidth
          variant="text"
          component="label"
          sx={{ mb: 2, color: "#00abfe", width: "50%", marginX: "25%" }}
          startIcon={<CloudUpload />}
        >
          Upload Book Cover
          <input type="file" hidden />
        </Button>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            height: "70px",
            borderRadius: "8px",
            bgcolor: "#00abfe",
            width: "50%",
            marginX: "25%",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      <Modal
        open={openAddBook}
        onClose={handleAddBookClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openAddBook}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add Book
            </Typography>
            <TextField
              fullWidth
              label="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                <MenuItem value="Mystery">Mystery</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: "#00abfe" }}
              onClick={handleAddBookClose}
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openSuccess}
        onClose={handleSuccessClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openSuccess}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Book successfully uploaded!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: "#00abfe" }}
              onClick={handleSuccessClose}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
}
