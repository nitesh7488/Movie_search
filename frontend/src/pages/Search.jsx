import React, { useState } from "react";
import API from "../api/api";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const doSearch = async () => {
    if (!q.trim()) return;
    const res = await API.get(`/api/movies/search?q=${encodeURIComponent(q)}`);
    setResults(res.data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        color: "#fff",
      }}
    >
      {/* Search Box Container */}
      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
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
          Search Movies
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Search by title or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputLabelProps={{
              style: { color: "#c7c7c7" },
            }}
            InputProps={{
              sx: {
                color: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6dd5fa",
                  boxShadow: "0 0 8px #6dd5fa88",
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={doSearch}
            sx={{
              px: 3,
              fontSize: "1rem",
              fontWeight: 600,
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
            Search
          </Button>
        </Stack>
      </Paper>

      {/* Results */}
      {results.length === 0 ? (
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mt: 4, color: "#bbb", animation: "fadeIn 0.5s ease-out" }}
        >
          No results yet. Try searching for a movie.
        </Typography>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{ mt: 2, px: { xs: 1, md: 4 }, animation: "fadeIn 0.6s ease-out" }}
        >
          {results.map((m) => (
            <Grid item key={m._id} xs={12} sm={6} md={3}>
              <MovieCard movie={m} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
