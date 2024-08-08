import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const StatCard = ({
  title,
  value,
  comparison,
  percentage,
  previousIncome,
  isIncrease,
  timePeriod,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Typography variant="body1" sx={{ color: "lightgray" }}>
          {title}
        </Typography>
        <Box
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
          {timePeriod}
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mr: 1 }}>
          {value}
        </Typography>
        {isIncrease ? (
          <ArrowUpwardIcon color="success" />
        ) : (
          <ArrowDownwardIcon color="error" />
        )}
        <Typography
          variant="body1"
          sx={{ color: isIncrease ? "green" : "red", ml: 0.5 }}
        >
          {percentage}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary">
        Compared to {comparison}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Last Month Income: {previousIncome}
      </Typography>
    </Paper>
  );
};

export default StatCard;
