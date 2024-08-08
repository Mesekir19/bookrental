import React, { useMemo } from "react";
import {
  Box,
  Avatar,
  Chip,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useRouter } from "next/navigation";

const LiveBookStatusTable = ({ data }) => {
  const router = useRouter();

  const columns = useMemo(
    () => [
      { accessorKey: "ownerId", header: "No.", size: 50 },
      { accessorKey: "id", header: "Book no.", size: 100 },
      {
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
      },
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
      { accessorKey: "rentPrice", header: "Price", size: 100 },
      {
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
      },
    ],
    []
  );

  const handleEdit = (row) => {
    console.log("Edit action for: ", row);
    const query = new URLSearchParams(row).toString();
    router.push(`/books/create?${query}`);
  };

  const handleDelete = (row) => {
    console.log("Delete action for: ", row);
  };

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return (
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
  );
};

export default LiveBookStatusTable;
