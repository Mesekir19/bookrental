import React, { useEffect, useMemo, useState } from "react";
import { Box, Avatar, Paper, Typography, Button, Switch } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  console.log("Books ", books);

  const handleApprove = async (bookId) => {
    try {
      const updatedBook = books.find((book) => book.id === bookId);
      const newStatus = !updatedBook.available;

      await axios.put(
        `http://localhost:5000/api/books/approve-book/${bookId}`,
        { available: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, available: newStatus } : book
        )
      );
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "quantity", header: "No.", size: 50 },
      { accessorKey: "author", header: "Author", size: 80 },
      {
        accessorKey: "ownerName",
        header: "Owner",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 24, height: 24, marginRight: 1 }}>
              {cell.getValue().charAt(0)}
            </Avatar>
            <Typography variant="body2">{cell.getValue()}</Typography>
          </Box>
        ),
        size: 100,
      },
      { accessorKey: "category", header: "Category", size: 80 },
      { accessorKey: "title", header: "Book Name", size: 100 },
      { accessorKey: "location", header: "Location", size: 100 },
      {
        accessorKey: "available",
        header: "Status",
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: cell.getValue() ? "#c5fcd0" : "transparent",
              borderRadius: "12px",
              padding: "2px 0",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            {cell.getValue() && <CheckIcon color="success" fontSize="small" />}
            <Typography
              variant="body2"
              sx={{
                marginLeft: 1,
                color: cell.getValue() ? "green" : "black",
                fontSize: "0.75rem",
              }}
            >
              {cell.getValue() ? "Active" : "Inactive"}
            </Typography>
            <Switch
              checked={cell.getValue()}
              color="success"
              size="small"
              sx={{
                width: 50,
                height: 20,
                "& .MuiSwitch-thumb": {
                  width: 14,
                  height: 14,
                  marginLeft: cell.getValue() ? 2 : 0,
                },
              }}
            />
          </Box>
        ),
        size: 80,
      },
      {
        accessorKey: "available",
        header: "Action",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              sx={{ bgcolor: row.original.available ? "#00abfe" : "gray" }}
              onClick={() => handleApprove(row.original.id)}
            >
              {row.original.available ? "Approved" : "Approve"}
            </Button>
          </Box>
        ),
        size: 80,
      },
    ],
    [books] // Depend on books to reflect updates
  );

  const table = useMaterialReactTable({
    columns,
    data: books,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ padding: 1, pr: 0, borderRadius: "8px", mr: -1 }}>
      <Paper
        elevation={3}
        sx={{ padding: 1, borderRadius: "8px", maxWidth: "1200px" }}
      >
        <Box sx={{ maxHeight: "81.5vh", overflowY: "auto", boxShadow: "none" }}>
          <Typography variant="h6">List of Books</Typography>
          <MaterialReactTable
            table={table}
            muiTableBodyRowProps={{
              sx: {
                "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                height: "36px",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                fontSize: "0.75rem",
                padding: "4px 8px",
              },
            }}
            muiTableProps={{
              sx: {
                rowStyle: { fontSize: "0.75rem", padding: "4px 8px" },
                tableLayout: "auto",
                cellStyle: {
                  padding: "4px 8px",
                },
                minWidth: "auto",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default BookTable;
