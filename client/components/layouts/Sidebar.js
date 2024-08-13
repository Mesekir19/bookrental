import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useRouter, usePathname } from "next/navigation"; // Correct import path

const Sidebar = ({ userRole, open, onToggle }) => {
  const router = useRouter(); // Get the current route
  const pathname = usePathname()
  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleLoginToggle = () => {
    const loginPath =
      userRole === "admin" ? "/auth/login" : "/auth/login";
    localStorage.removeItem("token");
    router.push(loginPath);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/" },
    ...(userRole === "admin"
      ? [
          { text: "Books", icon: <BookOutlinedIcon />, path: "/books" },
          {
            text: "Owners",
            icon: <PersonOutlineOutlinedIcon />,
            path: "/owners",
          },
        ]
      : []),
    ...(userRole === "owner"
      ? [
          {
            text: "Book Upload",
            icon: <BookOutlinedIcon />,
            path: "/books/create",
          },
        ]
      : []),
    { text: "Other", icon: <AddBoxOutlinedIcon />, path: "/other" },
    {
      text: "Notification",
      icon: <NotificationsNoneOutlinedIcon />,
      path: "/notification",
    },
    {
      text: "Settings",
      icon: <SettingsOutlinedIcon />,
      path: "/settings",
    },
    {
      text: userRole === "admin" ? "Login as Book Owner" : "Login as Admin",
      icon: <AccountCircleOutlinedIcon />,
      onClick: handleLoginToggle,
    },
  ];

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            height: 660,
            boxSizing: "border-box",
            backgroundColor: "#171b36",
            borderRadius: "8px",
            margin: "16px 0 16px 10px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            justifyContent: "flex-start",
          }}
        >
          <IconButton onClick={onToggle} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          <img
            src="/SmallBookRentalLogo.png"
            alt="logo"
            style={{ width: "15%", maxWidth: "50px", marginRight: 10 }}
          />
          <Typography variant="body2" color="#44d5f2">
            Book Rent
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
        <List>
          {menuItems.map((item, index) => {
            // Check if the current route matches the item's path
            const isSelected =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <ListItem
                button
                key={index}
                onClick={
                  item.path ? () => handleNavigation(item.path) : item.onClick
                }
                sx={{
                  backgroundColor: isSelected ? "#00abfe" : "transparent",
                  "&:hover": { backgroundColor: "#00abfe" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? "white" : "white",
                    minWidth: "30px",
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: "small" })}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: isSelected ? "white" : "white",
                    fontSize: "0.8rem",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
        <ListItem
          button
          sx={{
            marginTop: "auto",
            bgcolor: "#404161",
            alignItems: "center",
            marginBottom: "20px",
            borderRadius: "8px",
            width: "180px",
            marginX: "auto",
          }}
          onClick={handleLogout}
        >
          <ListItemIcon
            sx={{ color: "white", marginLeft: "30px", minWidth: "30px" }}
          >
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ color: "white", marginLeft: "-2px", fontSize: "0.8rem" }}
          />
        </ListItem>
      </Drawer>
      {!open && (
        <IconButton
          onClick={onToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: "white",
            backgroundColor: "#00abfe",
            "&:hover": {
              backgroundColor: "#003399",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
