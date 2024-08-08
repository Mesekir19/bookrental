import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";

const EarningSummaryChart = () => {
  const lastSixMonthsData = [10000, 26000, 15000, 25000, 22000, 8000];
  const samePeriodLastYearData = [
    8000, 18000, 13000, 23000, 21000, 24000,
  ];
  const xLabels = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Earning Summary</Typography>
        <Typography variant="body2">Mar 2022 - Oct 2024</Typography>
        <Box>
          <Box sx={{ display: "inline-block", mr: 2, fontSize: "12px" }}>
            <span style={{ color: "blue", marginRight: 8 }}>●</span>
            Last 6 months
          </Box>
          <Box sx={{ display: "inline-block", fontSize: "12px" }}>
            <span style={{ color: "gray", marginRight: 8 }}>●</span>
            Same period last year
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 210, mt: "-30px" }}>
        <LineChart
          width={700}
          height={230}
          series={[
            {
              data: lastSixMonthsData,
              label: "Last 6 months",
              id: "lastSixMonths",
            },
            {
              data: samePeriodLastYearData,
              label: "Same period last year",
              id: "lastYear",
            },
          ]}
          xAxis={[{ scaleType: "point", data: xLabels }]}
          sx={{
            [`.${lineElementClasses.root}`]: {
              strokeWidth: 2,
            },
            ".MuiLineElement-series-lastSixMonths": {
              stroke: "none",
              fill: "url(#gradient-blue)",
            },
            ".MuiLineElement-series-lastYear": {
              strokeDasharray: "5 5",
              stroke: "gray",
            },
            [`.${markElementClasses.root}`]: {
              display: "none",
            },
          }}
          slotProps={{
            legend: { hidden: true },
          }}
        >
          <defs>
            <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 123, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Paper>
  );
};

export default EarningSummaryChart;
