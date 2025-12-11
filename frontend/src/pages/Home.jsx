import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import {
  Grid,
  Pagination,
  Stack,
  Typography,
  Box,
  Container,
  Chip,
  Paper,
} from "@mui/material";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState("imdbRank");

  const SORT_OPTIONS = [
    { label: "Rank", value: "imdbRank" },
    { label: "Rating", value: "rating" },
    { label: "Title", value: "title" },
    { label: "Year", value: "year" },
  ];

  const fetchMovies = async (p = 1) => {
    try {
      const res = await API.get(`/api/movies?page=${p}&limit=12`);
      setMovies(res.data.movies);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSortedMovies = async (sort) => {
    try {
      const res = await API.get(`/api/movies/sorted?by=${sort}&order=desc`);
      setMovies(res.data);
      setPage(1);
      setPages(1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  useEffect(() => {
    if (sortBy === "imdbRank") fetchMovies(1);
    else fetchSortedMovies(sortBy);
  }, [sortBy]);

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await API.delete(`/api/movies/${id}`);

    if (sortBy === "imdbRank") fetchMovies(page);
    else fetchSortedMovies(sortBy);
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 8 }}>

      {/* HEADER */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          textAlign: "center",
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>
            🎬 Top Movies
          </Typography>

          {/* Chips Row */}
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            {SORT_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                clickable
                onClick={() => setSortBy(opt.value)}
                color={sortBy === opt.value ? "primary" : "default"}
                sx={{
                  fontWeight: "bold",
                  px: 2,
                  py: 1.5,
                  fontSize: "0.9rem",
                  borderRadius: "20px",
                  "&:hover": { opacity: 0.85 },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* MOVIE GRID */}
      {movies.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" color="text.secondary">
            No movies found.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {movies.map((m, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={m._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{ width: "100%" }}
              >
                <MovieCard
                  movie={m}
                  admin={user && user.role === "admin"}
                  onDelete={handleDelete}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* PAGINATION */}
      {sortBy === "imdbRank" && pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 6 }}>
          <Pagination
            color="primary"
            size="large"
            count={pages}
            page={page}
            onChange={(e, v) => fetchMovies(v)}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1.1rem",
                fontWeight: "bold",
              },
            }}
          />
        </Stack>
      )}
    </Container>
  );
}
