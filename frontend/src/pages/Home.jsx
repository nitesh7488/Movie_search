import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import {
  Grid,
  Pagination,
  Stack,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Container
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('imdbRank');

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

  // Initial load
  useEffect(() => {
    (async () => await fetchMovies(1))();
  }, []);

  // Sorting effect
  useEffect(() => {
    (async () => {
      if (sortBy === "imdbRank") await fetchMovies(1);
      else await fetchSortedMovies(sortBy);
    })();
  }, [sortBy]);

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/api/movies/${id}`);

    if (sortBy === "imdbRank") await fetchMovies(page);
    else await fetchSortedMovies(sortBy);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, px: 1 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Top Movies
        </Typography>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="imdbRank">Rank</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary">
            No movies found.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ px: 1 }}>
          {movies.map((m) => (
            <Grid item key={m._id} xs={12} sm={6} md={3}>
              <MovieCard
                movie={m}
                admin={user && user.role === 'admin'}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination – only in Rank mode */}
      {sortBy === "imdbRank" && (
        <Stack alignItems="center" sx={{ mt: 5 }}>
          <Pagination
            color="primary"
            size="large"
            count={pages}
            page={page}
            onChange={(e, v) => fetchMovies(v)}
          />
        </Stack>
      )}
    </Container>
  );
}
