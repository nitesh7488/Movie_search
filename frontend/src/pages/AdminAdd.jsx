import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminAdd() {
  const [movie, setMovie] = useState({
    title: "",
    year: "",
    rating: "",
    duration: "",
    description: "",
    poster: "",
  });

  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/api/movies", movie);
    alert("Movie Added Successfully!");
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "110vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          animation: "fadeIn 0.7s ease-out"
        }}
      >
        <Typography
          variant="h4"
          fontWeight="700"
          textAlign="center"
          sx={{
            mb: 4,
            background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          Add New Movie
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Title"
            fullWidth
            value={movie.title}
            onChange={(e) => setMovie({ ...movie, title: e.target.value })}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={inputGlow}
          />

          <TextField
            label="Year"
            fullWidth
            value={movie.year}
            onChange={(e) => setMovie({ ...movie, year: e.target.value })}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={inputGlow}
          />

          <TextField
            label="Rating"
            fullWidth
            value={movie.rating}
            onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={inputGlow}
          />

          <TextField
            label="Duration"
            fullWidth
            value={movie.duration}
            onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={inputGlow}
          />

          <TextField
            label="Poster URL"
            fullWidth
            value={movie.poster}
            onChange={(e) => setMovie({ ...movie, poster: e.target.value })}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={inputGlow}
          />

          <TextField
            label="Description"
            multiline
            rows={5}
            fullWidth
            value={movie.description}
            onChange={(e) =>
              setMovie({ ...movie, description: e.target.value })
            }
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            InputProps={{
              ...inputGlow,
              sx: {
                color: "white",
                borderRadius: 2,
                "& textarea": { color: "white !important" }
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={submit}
            sx={{
              mt: 2,
              py: 1.2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg, #6dd5fa, #2980b9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #81ecec, #3498db)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.5)"
              },
              transition: "0.25s ease"
            }}
          >
            Add Movie
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

// ⭐ Neon Glow Styling Reusable for Inputs
const inputGlow = {
  sx: {
    color: "white",
    borderRadius: 2,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6dd5fa"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6dd5fa",
      boxShadow: "0 0 10px #6dd5fa88"
    }
  }
};
