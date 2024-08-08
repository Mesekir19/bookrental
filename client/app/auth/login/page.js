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
} from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <>
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
              Login
            </Typography>
            <Divider sx={{ borderColor: "lightgray", width: "100%", mb: 2 }} />
            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#00abfe" }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    href="#"
                    underline="none"
                    color="#00abfe"
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  Don't have an account?
                  <Link
                    href="/auth/register"
                    underline="none"
                    color="#00abfe"
                    variant="body2"
                  >
                    {" Sign Up"}
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
