import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="700"
          sx={{
            mb: 3,
            background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Welcome Back
        </Typography>

        <Stack spacing={2}>
          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={{
              sx: {
                color: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                  boxShadow: "0 0 10px #6dd5fa88",
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
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={{
              sx: {
                color: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                  boxShadow: "0 0 10px #6dd5fa88",
                },
              },
            }}
          />

          {/* Button */}
          <Button
            onClick={submit}
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1.2,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #81ecec, #3498db)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
              },
              transition: "0.25s ease",
            }}
          >
            Login
          </Button>

          {/* Link */}
          <Typography textAlign="center" sx={{ mt: 1, color: "#ddd" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#6dd5fa", textDecoration: "none", fontWeight: 600 }}
            >
              Register
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
