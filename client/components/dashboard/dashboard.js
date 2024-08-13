"use client";
import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import StatCard from "./components/card";
import LiveBookStatusTable from "./components/liveBookStatusTable";
import EarningSummaryChart from "./components/earningSummaryChart";
import AvailableBooks from "./components/pieChart";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "@/Context/UserContext";

export default function Dashboard() {
  const { userId, userRole } = useContext(UserContext);
  const now = new Date();
  const formattedDate = format(now, "EEE, dd MMM, yyyy, hh:mm a");
  const [books, setBooks] = useState([]);
  const [walletData, setWalletData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
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
        setBooks(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching books:", err);
      }
    };

    const fetchWalletData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books/wallet-balance/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWalletData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    fetchWalletData();
  }, [userId, userRole]);
  console.log("books ", books);
  console.log("walletData ", walletData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ flexGrow: 1, pl: 1, mr: -1, mt: "15px", boxShadow: "none" }}>
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
                value={`ETB ${walletData.currentMonthIncome || 0}`}
                comparison={`ETB ${walletData.lastMonthIncome || 0} last month`}
                percentage={`${
                  walletData.monthPercentageChange
                    ? walletData.monthPercentageChange.toFixed(2) + "%"
                    : "N/A"
                }`}
                previousIncome={`ETB ${walletData.currentMonthIncome || 0}`}
                isIncrease={walletData.monthPercentageChange > 0}
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
