import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import { UserContext } from "@/Context/UserContext";

const colorMapping = {
  Fiction: "#f44336",
  "Self Help": "#3f51b5",
  Business: "#ffeb3b",
  Science: "#4caf50",
  History: "#ff9800",
  // Add more categories and colors as needed
};

const AvailableBooks = () => {
  const { userRole } = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url =
        userRole === "admin"
          ? "http://localhost:5000/api/books/available-books"
          : "http://localhost:5000/api/books/by-user";
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const processedData = processCategoryData(response.data);
      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processCategoryData = (books) => {
    const categoryCounts = books.reduce((acc, book) => {
      const { category } = book;
      if (category in acc) {
        acc[category] += 1;
      } else {
        acc[category] = 1;
      }
      return acc;
    }, {});

    return Object.entries(categoryCounts).map(([label, value]) => ({
      label,
      value,
    }));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ color: "lightgray" }}>
          Available Books
        </Typography>
        <Box
          size="small"
          variant="contained"
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#000",
            textTransform: "none",
            borderRadius: "5px",
            fontSize: "12px",
            px: "10px",
            py: "3px",
          }}
        >
          Today
        </Box>
      </Box>
      <PieChart
        series={[
          {
            data: data.map((item) => ({
              ...item,
              color: colorMapping[item.label] || "#ccc", // Default color if not mapped
            })),
            innerRadius: 60,
            outerRadius: 80,
            cx: 110,
            cy: 80,
          },
        ]}
        height={200}
        slotProps={{
          legend: { hidden: true },
        }}
      />
      <Box sx={{ mt: "-20px" }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: colorMapping[item.label] || "#ccc", // Default color if not mapped
                mr: 1,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "70%",
              }}
            >
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2">{item.value}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AvailableBooks;
