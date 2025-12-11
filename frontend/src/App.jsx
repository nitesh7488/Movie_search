import React, { useContext, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminAdd from "./pages/AdminAdd";
import AdminEdit from "./pages/AdminEdit";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import MovieDetails from "./components/MovieDetails";

export default function App() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  /* Mobile menu toggler */
  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      {/* PREMIUM NAVBAR */}
      <AppBar
        position="sticky"
        elevation={12}
        sx={{
          background: "rgba(15, 12, 41, 0.55)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        <Toolbar sx={{ py: 1, display: "flex", alignItems: "center" }}>
          
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              flex: 1,
              textDecoration: "none",
              fontWeight: 800,
              letterSpacing: 0.8,
              background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "1.7rem",
              transition: ".3s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            MovieApp
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={toggleDrawer} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER MENU */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            MovieApp Menu
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List>
            <MobileItem to="/" text="Home" />
            <MobileItem to="/search" text="Search" />

            {!user && (
              <>
                <MobileItem to="/login" text="Login" />
                <MobileItem to="/register" text="Register" />
              </>
            )}

            {user && (
              <>
                {user.role === "admin" && (
                  <MobileItem to="/admin/add" text="Admin Panel" />
                )}

                <ListItemButton onClick={logout}>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 700,
                      color: "#ef5350",
                    }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* PAGE CONTENT */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />

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

/*  NAV BUTTON (DESKTOP) */
function NavButton({ to, children }) {
  return (
    <Button
      component={Link}
      to={to}
      sx={{
        color: "#fff",
        mx: 1,
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

/* MOBILE NAV ITEM */
function MobileItem({ to, text }) {
  return (
    <ListItemButton component={Link} to={to}>
      <ListItemText
        primary={text}
        primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
      />
    </ListItemButton>
  );
}
