import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const Header = ({userRole}) => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const path = pathname;
    console.log(path);
    switch (path) {
      case "/":
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Dashboard`
        );
        break;
      case "/books":
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Books`
        );
        break;
      case "/books/create":
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Book Upload`
        );
        break;
      case "/owners":
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Owners`
        );
        break;
      case "/settings":
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Settings`
        );
        break;
      // Add more cases as needed for additional routes
      default:
        setPageTitle(
          `${
            userRole === "admin"
              ? "Admin"
              : userRole === "owner"
              ? "Owner"
              : "User"
          }/Dashboard`
        );
    }
  }, [pathname, userRole]);


  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: 2,
        mx: 1,
        mb: 1,
        mt: -1,
        boxShadow: "none",

      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
          {pageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
