import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/api/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 3,
        background: "radial-gradient(circle at top, #10101a, #07070d)",
      }}
    >
      <Paper
        elevation={15}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: "rgba(17, 25, 40, 0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          backdropFilter: "blur(14px)",
          color: "#fff",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="800"
          sx={{
            mb: 3,
            letterSpacing: 0.8,
            background: "linear-gradient(90deg, #6dd5fa, #1b9cfc)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Login
        </Typography>

        {/* Error Box */}
        {errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              fontWeight: 600,
              background: "rgba(255,0,0,0.15)",
              color: "#ff8a8a",
              border: "1px solid rgba(255,0,0,0.25)",
            }}
          >
            {errorMsg}
          </Alert>
        )}

        <Stack spacing={2}>
          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            InputLabelProps={{
              sx: {
                color: "#9bb0c3",
                "&.Mui-focused": { color: "#6dd5fa" },
              },
            }}
            InputProps={{
              sx: {
                color: "#fff",
                fontSize: "1rem",
                height: 50,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                px: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                  boxShadow: "0 0 10px rgba(109,213,250,0.6)",
                },
                "& input::placeholder": {
                  color: "#9bb0c3",
                },
              },
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "#9bb0c3",
                "&.Mui-focused": { color: "#6dd5fa" },
              },
            }}
            InputProps={{
              sx: {
                color: "#fff",
                fontSize: "1rem",
                height: 50,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                px: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                  boxShadow: "0 0 10px rgba(109,213,250,0.6)",
                },
              },
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            disabled={loading}
            onClick={submit}
            variant="contained"
            sx={{
              mt: 1,
              py: 1.3,
              fontSize: "1.05rem",
              fontWeight: "bold",
              borderRadius: 3,
              background: "linear-gradient(90deg, #6dd5fa, #1b9cfc)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transition: ".25s",
              "&:hover": {
                background: "linear-gradient(90deg, #81ecec, #3498db)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 28px rgba(0,0,0,0.5)",
              },
            }}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </Button>

          {/* Register Link */}
          <Typography
            textAlign="center"
            sx={{ mt: 1, color: "#ccc", fontSize: "0.95rem" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#6dd5fa",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
