import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie, admin = false, onDelete }) {
  const posterFallback = 'https://picsum.photos/seed/movie-fallback/300/450';

  return (
    <Card
      sx={{
        maxWidth: 260,
        height: "100%",
        borderRadius: 3,
        bgcolor: "#1e1e1e",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "0.25s ease",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.35)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 8px 28px rgba(0,0,0,0.55)"
        }
      }}
    >
      <CardActionArea
        component={Link}
        to={`/movie/${movie._id || ""}`}
        sx={{ alignItems: "stretch" }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="360"
            image={movie.poster || posterFallback}
            alt={movie.title}
            sx={{ objectFit: "cover", filter: "brightness(0.92)" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = posterFallback;
            }}
          />

          {/* Rating chip */}
          <Chip
            icon={<StarIcon sx={{ color: "#FFD700" }} />}
            label={movie.rating}
            size="small"
            sx={{
              position: "absolute",
              left: 10,
              top: 10,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontWeight: 600,
              backdropFilter: "blur(4px)"
            }}
          />

          {/* Rank chip */}
          {movie.imdbRank && (
            <Chip
              label={`#${movie.imdbRank}`}
              size="small"
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
                bgcolor: "#FFD700",
                color: "#000",
                fontWeight: 700
              }}
            />
          )}
        </Box>

        {/* Content */}
        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#fff",
              mb: 0.5,
              fontSize: "1.05rem",
              textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
            }}
            noWrap
          >
            {movie.title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
              {movie.year}
            </Typography>
            {movie.duration && (
              <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                • {movie.duration}
              </Typography>
            )}
          </Stack>

          {movie.description && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#cfcfcf",
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      {/* Admin Buttons */}
      {admin && (
        <CardActions sx={{ mt: "auto", px: 1.5, pb: 1.5, justifyContent: "flex-end" }}>
          <Tooltip title="Edit Movie">
            <IconButton
              size="small"
              component={Link}
              to={`/admin/edit/${movie._id}`}
              sx={{ color: "#90caf9" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Movie">
            <IconButton
              size="small"
              onClick={() => onDelete && onDelete(movie._id)}
              sx={{ color: "#ef5350" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
}
