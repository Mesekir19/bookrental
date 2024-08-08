import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";

const data2 = [
  { label: "Fiction", value: 54 },
  { label: "Self Help", value: 20 },
  { label: "Business", value: 26 },
];

export default function AvailableBooks() {
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
            data: data2,
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
        {data2.map((item, index) => (
          <Box item key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: ["#f44336", "#3f51b5", "#ffeb3b"][index],
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
}
