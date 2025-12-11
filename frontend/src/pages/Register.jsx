import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  MenuItem,
  Alert,
} from "@mui/material";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    setErrorMsg("");
    try {
      await API.post("/api/auth/register", { name, email, password, role });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed.");
    }
  };

  //  Reusable perfect input styles
  const inputBaseStyle = {
    color: "#fff",
    fontSize: "1.05rem",
    fontWeight: 500,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 2,
    height: 56,
    px: 2,

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.18)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#38c5ff",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#38c5ff",
      boxShadow: "0 0 8px #38c5ff80",
    },
  };

  const labelStyle = {
    color: "#9fb4c9",
    fontSize: "1rem",
    "&.Mui-focused": { color: "#38c5ff", fontWeight: 600 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0f24",
        px: 2,
      }}
    >
      <Paper
        elevation={14}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          color: "#fff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.55)",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={800}
          sx={{
            mb: 3,
            letterSpacing: "0.5px",
            color: "#2ed8ff",
          }}
        >
          Create Account
        </Typography>

        {/* Error Box */}
        {errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              background: "rgba(255,0,0,0.15)",
              border: "1px solid rgba(255,0,0,0.3)",
              color: "#ff9a9a",
            }}
          >
            {errorMsg}
          </Alert>
        )}

        <Stack spacing={2}>
          {/* NAME */}
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ sx: labelStyle }}
            InputProps={{ sx: inputBaseStyle }}
          />

          {/* EMAIL */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ sx: labelStyle }}
            InputProps={{ sx: inputBaseStyle }}
          />

          {/* PASSWORD */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ sx: labelStyle }}
            InputProps={{ sx: inputBaseStyle }}
          />

          {/* ROLE SELECTOR */}
          <TextField
            select
            label="Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            InputLabelProps={{ sx: labelStyle }}
            InputProps={{ sx: inputBaseStyle }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {/* REGISTER BUTTON */}
          <Button
            fullWidth
            variant="contained"
            onClick={submit}
            sx={{
              mt: 1,
              py: 1.3,
              fontSize: "1.05rem",
              fontWeight: 700,
              borderRadius: 2,
              background: "linear-gradient(90deg, #2ed8ff, #0072ff)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              "&:hover": {
                background: "linear-gradient(90deg, #49e8ff, #0084ff)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Register
          </Button>

          {/* LOGIN LINK */}
          <Typography
            textAlign="center"
            sx={{ mt: 1, color: "#cdd7e3", fontSize: "0.95rem" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#2ed8ff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
