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


const NEON_BLUE = "#6dd5fa";
const DELETE_RED = "#ff4d4d";
const posterFallback = 'https://picsum.photos/seed/movie-fallback/300/450';


const adminActionIconStyle = (color) => ({
    color: color,
    transition: '0.3s ease',
    p: 0.8, 
    borderRadius: '8px',
    '&:hover': {
        bgcolor: `${color}1A`, 
        boxShadow: `0 0 10px ${color}88`,
        transform: 'scale(1.05)',
    },
});

export default function MovieCard({ movie, admin = false, onDelete }) {

    
    const handleDeleteClick = (e) => {
        
        e.preventDefault(); 
        e.stopPropagation();

        if (window.confirm(`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`)) {
            onDelete && onDelete(movie._id);
        }
    };
    
    // Handler for edit action - ensures CardActionArea link doesn't fire
    const handleEditClick = (e) => {
        e.stopPropagation();
    }

    return (
        <Card
            sx={{
                width: "100%",
                height: 370,
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                color: "#fff",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "0.25s ease",
                boxShadow: "0px 4px 18px rgba(0,0,0,0.30)",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0px 6px 28px ${NEON_BLUE}22`,
                }
            }}
        >
            {/* The entire top section is the clickable link to the details page */}
            <CardActionArea
                component={Link}
                to={`/movie/${movie._id || ""}`}
                sx={{ 
                    flexGrow: 1, 
                    alignItems: "stretch",
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <CardMedia
                        component="img"
                        height="220"
                        image={movie.poster || posterFallback}
                        alt={movie.title}
                        sx={{ objectFit: "cover" }}
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
                <CardContent sx={{ px: 2, py: 1.5, flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#fff",
                            fontSize: "1rem",
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

                    {/* 2–3 line description (fixed height) */}
                    {movie.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                color: "#cfcfcf",
                                fontSize: "0.85rem",
                                lineHeight: 1.35,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "38px",
                            }}
                        >
                            {movie.description}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>

            {/* -------------------- ADMIN BUTTONS (BOTTOM) -------------------- */}
            {admin && (
                <CardActions sx={{ 
                    px: 1, 
                    pb: 1, 
                    pt: 0,
                    mt: "auto", 
                    justifyContent: "flex-end", 
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <Tooltip title="Edit Movie">
                        <IconButton
                            size="small"
                            component={Link}
                            to={`/admin/edit/${movie._id}`}
                            onClick={handleEditClick}
                            sx={adminActionIconStyle(NEON_BLUE)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Movie">
                        <IconButton
                            size="small"
                            onClick={handleDeleteClick}
                            sx={adminActionIconStyle(DELETE_RED)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            )}
        </Card>
    );
}