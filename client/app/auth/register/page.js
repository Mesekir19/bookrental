"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  CssBaseline,
} from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("user");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        username,
        password,
        location,
        phoneNumber,
        role,
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to register user", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: "#171b36",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/BookRentalLogo.png"
            alt="logo"
            style={{ width: "50%", maxWidth: "300px" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mb: 2,
              }}
            >
              <img
                src="/SmallBookRentalLogo.png"
                alt="logo"
                style={{ width: "10%", maxWidth: "50px", marginRight: 10 }}
              />
              <Typography component="h1" variant="h4">
                Book Rent
              </Typography>
            </Box>
            <Typography variant="h6" align="left" sx={{ width: "100%" }}>
              Register
            </Typography>
            <Divider sx={{ borderColor: "lightgray", width: "100%", mb: 2 }} />
            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                name="location"
                label="Location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                placeholder="940404040"
                size="small"
                name="phoneNumber"
                label="Phone Number"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(parseInt(e.target.value, 10))}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                size="small"
                name="role"
                label="Role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="I Accept the Terms and Conditions"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#00abfe" }}
                onClick={handleRegister}
              >
                Register
              </Button>
              <Grid container>
                <Grid item xs>
                  Already have an account?
                  <Link
                    href="/auth/login"
                    underline="none"
                    color="#00abfe"
                    variant="body2"
                  >
                    {" Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
