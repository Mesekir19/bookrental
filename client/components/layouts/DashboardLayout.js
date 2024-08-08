import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { UserContext } from "@/Context/UserContext";
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Initially open
  const { userRole } = useContext(UserContext);
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eaeffa" }}>
      <Sidebar
        userRole={userRole}
        open={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s ease",
          marginLeft: isSidebarOpen ? "0px" : "-240px",
        }}
      >
        <Header userRole={userRole} isSidebarOpen={isSidebarOpen} />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
