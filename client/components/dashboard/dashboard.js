"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import StatCard from "./components/card";
import LiveBookStatusTable from "./components/liveBookStatusTable";
import EarningSummaryChart from "./components/earningSummaryChart";
import AvailableBooks from "./components/pieChart";
import { format } from "date-fns";
import axios from "axios";
export default function Dashboard() {
  const now = new Date();
  const formattedDate = format(now, "EEE, dd MMM, yyyy, hh:mm a");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("books ", books);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books/available-books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); // Replace with your API URL
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const data = [
    {
      no: 1,
      bookNo: 6465,
      owner: "Nardos T",
      status: "Rented",
      price: "40 Birr",
    },
    {
      no: 2,
      bookNo: 6465,
      owner: "Nardos T",
      status: "Rented",
      price: "40 Birr",
    },
    {
      no: 3,
      bookNo: 6465,
      owner: "Nardos T",
      status: "Rented",
      price: "40 Birr",
    },
    {
      no: 4,
      bookNo: 5665,
      owner: "Harry M",
      status: "Free",
      price: "0.0 Birr",
    },
    {
      no: 5,
      bookNo: 5665,
      owner: "Harry M",
      status: "Free",
      price: "0.0 Birr",
    },
    {
      no: 6,
      bookNo: 1755,
      owner: "Tesfu N",
      status: "Free",
      price: "0.0 Birr",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, pl: 1,mr:-1, mt: "15px", boxShadow: "none" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3.5}>
          <Paper sx={{ p: 2, pb: 1.5, borderRadius: "8px", boxShadow: "none" }}>
            <Typography>This Month Statistics</Typography>
            <Typography variant="subtitle2" sx={{ color: "lightgray" }}>
              {formattedDate}
            </Typography>
            <Box sx={{ pt: 1 }}>
              <StatCard
                title="Income"
                value="ETB 9460.00"
                comparison="ETB 8940 last month"
                percentage="1.5%"
                previousIncome="ETB 25658.00"
                isIncrease={false}
                timePeriod="This Month"
              />
            </Box>
            <AvailableBooks />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8.5} sx={{ boxShadow: "none" }}>
          <Box sx={{ boxShadow: "none" }}>
            <LiveBookStatusTable data={books} />
          </Box>
          <Box sx={{ mt: "15px", boxShadow: "none" }}>
            <EarningSummaryChart />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
