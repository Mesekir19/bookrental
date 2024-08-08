import * as React from "react";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Typography,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Grid,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/Context/UserContext";
import axios from "axios";
const bookData = [
  { name: "Book 1", author: "Author 1", category: "Fiction" },
  { name: "Book 2", author: "Author 2", category: "Business" },
];

export default function UploadNewBook() {
    const router = useRouter();
    const {userId} = useContext(UserContext);

  const [openAddBook, setOpenAddBook] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [bookName, setBookName] = React.useState("");
  const [authorName, setAuthorName] = React.useState("");
  const [bookQuantity, setBookQuantity] = React.useState("");
  const [rentPrice, setRentPrice] = React.useState("");

  const handleAddBookOpen = () => setOpenAddBook(true);
  const handleAddBookClose = () => setOpenAddBook(false);
  const handleSuccessOpen = () => setOpenSuccess(true);
  const handleSuccessClose = () => setOpenSuccess(false);

  const handleBookSelect = (event) => {
    const value = event.target.value;
    if (value === "Add Book") {
      handleAddBookOpen();
    } else {
      const selected = bookData.find((book) => book.name === value);
      if (selected) {
        setBookName(selected.name);
        setAuthorName(selected.author);
        setCategory(selected.category);
      }
    }
    setSelectedBook(value);
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        title: bookName,
        author: authorName,
        category,
        quantity: bookQuantity,
        rentPrice,
        ownerId: userId,
      };

      console.log(formData); // For debugging

      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/books",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If you need to send a token
          },
        }
      );

      console.log("Response:", response.data);
      handleSuccessOpen(); // Call success handler if the request is successful
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error appropriately (e.g., show an error message to the user)
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
          <InputLabel>Search book by name or Author</InputLabel>
          <Select value={selectedBook} onChange={handleBookSelect}>
            {bookData.map((book) => (
              <MenuItem key={book.name} value={book.name}>
                {book.name}
              </MenuItem>
            ))}
            <MenuItem value="Add Book">Add Book</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Book Quantity</InputLabel>
              <Select
                value={bookQuantity}
                onChange={(e) => setBookQuantity(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Rent price for 2 weeks"
              variant="outlined"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
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
            />
            <TextField
              fullWidth
              label="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value={"Fiction"}>Fiction</MenuItem>
                <MenuItem value={"Self Help"}>Self Help</MenuItem>
                <MenuItem value={"Business"}>Business</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#00abfe" }}
              onClick={handleAddBookClose}
            >
              Add
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
              width: 300,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              🎉
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Congrats!
            </Typography>
            <Typography sx={{ mb: 4 }}>
              Your book has been uploaded successfully. Wait until we approve
              it.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSuccessClose}
            >
              OK
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
}
