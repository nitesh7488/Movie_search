import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminAdd from "./pages/AdminAdd";
import AdminEdit from "./pages/AdminEdit";
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* PREMIUM NAVBAR */}
      <AppBar
        position="sticky"
        elevation={10}
        sx={{
          background: "rgba(15, 12, 41, 0.55)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              flex: 1,
              textDecoration: "none",
              fontWeight: "700",
              letterSpacing: 0.8,
              background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "1.7rem",
              transition: "0.3s",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            MovieApp
          </Typography>

          {/* Nav Buttons */}
          <NavButton to="/search">Search</NavButton>

          {user ? (
            <>
              {user.role === "admin" && (
                <NavButton to="/admin/add">Admin</NavButton>
              )}

              <Button
                onClick={logout}
                sx={{
                  ml: 1,
                  color: "#fff",
                  textTransform: "none",
                  px: 2,
                  fontSize: "1rem",
                  transition: "0.25s",
                  "&:hover": {
                    color: "#6dd5fa",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavButton to="/login">Login</NavButton>
              <NavButton to="/register">Register</NavButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Page Container */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <AdminAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminEdit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

/* 🔥 Custom Premium Nav Button Component */
function NavButton({ to, children }) {
  return (
    <Button
      component={Link}
      to={to}
      sx={{
        color: "#fff",
        mx: 0.5,
        textTransform: "none",
        fontSize: "1rem",
        borderRadius: 1,
        px: 2,
        transition: "0.25s",
        "&:hover": {
          color: "#6dd5fa",
          transform: "translateY(-2px)",
        },
      }}
    >
      {children}
    </Button>
  );
}
