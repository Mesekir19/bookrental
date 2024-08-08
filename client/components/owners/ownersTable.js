import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Avatar,
  Button,
  IconButton,
  Paper,
  Typography,
  Divider,
  Chip,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import TuneIcon from "@mui/icons-material/Tune";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";

const OwnerTable = () => {
  const [data, setData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchData = async () => {
     try {
       const token = localStorage.getItem("token"); // Retrieve the token from localStorage
       const response = await axios.get("http://localhost:5000/api/users", {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       setData(response.data);
       setLoading(false);
     } catch (error) {
       setSnackbarMessage("Failed to fetch data");
       setSnackbarOpen(true);
       setLoading(false);
     }
   };
   fetchData();
 }, []);

 const handleApprove = async (ownerId) => {
   try {
     const token = localStorage.getItem("token"); // Retrieve the token from localStorage
     await axios.post(
       `http://localhost:5000/api/users/approve-user/${ownerId}`,
       {},
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
     setData((prevData) =>
       prevData.map((item) =>
         item.id === ownerId ? { ...item, approved: true } : item
       )
     );
     setSnackbarMessage("Owner approved successfully");
     setSnackbarOpen(true);
   } catch (error) {
     setSnackbarMessage("Failed to approve owner");
     setSnackbarOpen(true);
   }
 };

 const handleDelete = async (ownerId) => {
   try {
     const token = localStorage.getItem("token"); // Retrieve the token from localStorage
     await axios.delete(`http://localhost:5000/api/users/${ownerId}`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     setData((prevData) => prevData.filter((item) => item.id !== ownerId));
     setSnackbarMessage("Owner deleted successfully");
     setSnackbarOpen(true);
   } catch (error) {
     setSnackbarMessage("Failed to delete owner");
     setSnackbarOpen(true);
   }
 };


  const handleStatusToggle = async (ownerId, currentStatus) => {
    try {
      await axios.post(`http://localhost:5000/api/owners/${ownerId}/status`, {
        status: !currentStatus,
      }); // Update with your endpoint
      setData((prevData) =>
        prevData.map((item) =>
          item.id === ownerId ? { ...item, status: !currentStatus } : item
        )
      );
      setSnackbarMessage("Owner status updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to update owner status");
      setSnackbarOpen(true);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "No.", size: 50 },
      {
        accessorKey: "name",
        header: "Owner",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} />
            <Typography variant="body2">{cell.getValue()}</Typography>
          </Box>
        ),
        size: 150,
      },
      {
        accessorKey: "bookCount",
        header: "Upload",
        Cell: ({ cell }) => (
          <Typography variant="inherit">{`${cell.getValue()} Books`}</Typography>
        ),
        size: 100,
      },
      { accessorKey: "role", header: "Location", size: 150 },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: cell.getValue() ? "#c5fcd0" : "transparent",
              borderRadius: "12px",
              padding: "4px 0",
              justifyContent: "space-evenly",
            }}
          >
            {cell.getValue() && <CheckIcon color="success" fontSize="small" />}
            <Typography
              variant="body2"
              sx={{ marginLeft: 1, color: cell.getValue() ? "green" : "black" }}
            >
              {cell.getValue() ? "Active" : "Inactive"}
            </Typography>
            <Switch
              checked={cell.getValue()}
              color="success"
              size="small"
              onChange={() =>
                handleStatusToggle(row.original.id, cell.getValue())
              }
              sx={{
                width: 68,
                height: 24,
                "& .MuiSwitch-thumb": {
                  width: 16,
                  height: 16,
                  marginLeft: cell.getValue() ? 3.5 : 0,
                },
              }}
            />
          </Box>
        ),
        size: 150,
      },
      {
        accessorKey: "isApproved",
        header: "Action",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              // color={row.original.isApproved ? "primary" : "inherit"} // Adjust color based on isApproved
              size="small"
              sx={{ bgcolor: row.original.isApproved ? "#00abfe" : "gray" }}
              onClick={() => handleApprove(row.original.id)}
            >
              {row.original.isApproved ? "Approved" : "Approve"}
            </Button>
          </Box>
        ),
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading: loading,
    },
  });

  return (
    <Box sx={{ padding: 1, pr: 0, borderRadius: "8px", mr: -1 }}>
      <Paper elevation={3} sx={{ padding: 1, borderRadius: "8px" }}>
        <Box sx={{ maxHeight: "81.5vh", overflowY: "auto" }}>
          <Typography variant="h6">List of Owners</Typography>
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
              },
            }}
          />
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerTable;
