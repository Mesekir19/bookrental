import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Avatar,
  Chip,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useRouter } from "next/navigation";
import { UserContext } from "@/Context/UserContext";
import axios from "axios";

const LiveBookStatusTable = ({ data }) => {
  const router = useRouter();
  const { userRole } = useContext(UserContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "rentedCount",
        header: "No.",
        size: 50,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "4px 8px",
              textAlign: "center",
            }}
          >
            {row.original.status === "rented"
              ? row.original.rentedCount
              : row.original.quantity}
          </Box>
        ),
      },
      {
        accessorKey: "id",
        header: "Book no.",
        size: 100,
        Cell: ({ cell }) => (
          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "4px 8px",
              textAlign: "center",
            }}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      { accessorKey: "title", header: "Book Name", size: 150 },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Chip
              color={cell.getValue() === "free" ? "primary" : "secondary"}
              sx={{
                backgroundColor: cell.getValue() === "free" ? "blue" : "red",
                color: "white",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              {cell.getValue().toUpperCase()}
            </Typography>
          </Box>
        ),
        size: 100,
      },
      {
        accessorKey: "rentPrice",
        header: "Price",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            {cell.getValue()} Birr
          </Typography>
        ),
      },
    ];

    if (userRole === "admin") {
      baseColumns.splice(2, 0, {
        accessorKey: "ownerName",
        header: "Owner",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{ marginRight: 1, width: 24, height: 24, fontSize: 12 }}
            >
              {cell.getValue().charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              {cell.getValue()}
            </Typography>
          </Box>
        ),
        size: 150,
      });
    } else {
      baseColumns.push({
        accessorKey: "actions",
        header: "Action",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{ color: "black" }}
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ color: "red" }}
              size="small"
              onClick={() => handleDelete(row.original)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
        size: 100,
      });
    }

    return baseColumns;
  }, [userRole]);

  const handleEdit = (row) => {
    console.log("Edit action for: ", row);
    const query = new URLSearchParams({
      bookName: row.title,
      bookId: row.id,
      authorName: row.author,
      category: row.category,
      bookQuantity: row.quantity,
      rentPrice: row.rentPrice,
    }).toString();
    router.push(`/books/create?${query}`);
  };

  const handleDelete = (row) => {
    setSelectedBook(row);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${selectedBook.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Refresh data or handle successful deletion
      setOpenDialog(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return (
    <>
      <Paper
        sx={{
          p: 2,
          width: "100%",
          height: "330px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
          borderRadius: "8px",
          boxShadow: "none",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 16 }}>
          Live Book Status
        </Typography>
        <Box sx={{ overflowY: "auto" }}>
          <MaterialReactTable
            table={table}
            options={{
              pagination: false,
              search: false,
              sorting: false,
              rowStyle: { fontSize: "0.75rem", padding: "4px 8px" },
              tableLayout: "auto",
              cellStyle: {
                padding: "4px 8px",
              },
            }}
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
          />
        </Box>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the book "{selectedBook?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LiveBookStatusTable;
