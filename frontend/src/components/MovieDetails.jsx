import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Grid,
    Paper,
    Chip,
    Stack,
    Divider,
    Button,
    useMediaQuery,
    IconButton,
    Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; 
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api"; 

// --- Configuration ---
const NEON_COLOR = "#6dd5fa"; // Primary Neon Blue
const posterFallback = 'https://picsum.photos/seed/movie-fallback/600/900';

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 1. Fetch Movie Details with Fallback Logic
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // PRIMARY ATTEMPT: Fetch single movie by ID (Best Practice)
                let res = await API.get(`/api/movies/${id}`);
                
                // Assuming successful single fetch returns the movie object directly
                if (res.data) {
                    setMovie(res.data);
                } else {
                    // Fall through to the fallback if the single fetch was successful but empty
                    throw new Error("Single movie endpoint returned empty data.");
                }
                
            } catch (err) {
                console.warn(`Primary fetch for movie ID ${id} failed. Attempting fallback...`);
                
                // FALLBACK ATTEMPT: Fetch all movies and find the match
                try {
                    const fallbackRes = await API.get(`/api/movies`);
                    // Assuming the fallback returns an array of movies under res.data.movies
                    const found = fallbackRes.data.movies.find(m => m._id === id); 
                    
                    if (found) {
                        setMovie(found);
                    } else {
                        setError("Movie not found in the database. The ID may be invalid.");
                    }
                } catch (fallbackErr) {
                    console.error("Fallback fetch failed:", fallbackErr);
                    setError("Failed to load movie details. Check your network or API configuration.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetails(); 
    }, [id]);

    // 2. Handlers
    const handleClose = () => {
        navigate('/'); // Navigate back to the main list
    };

    // 3. Loading and Error States
    if (loading) return <Box sx={styles.statusContainer}><CircularProgress color="inherit" /><Typography variant="h6" sx={{ mt: 2, color: '#fff' }}>Loading Movie...</Typography></Box>;
    if (error || !movie) return (
        <Box sx={styles.statusContainer}>
            <Alert severity="error" sx={{ maxWidth: 400, mb: 3 }}>{error || "Movie data is unavailable."}</Alert>
            <Button onClick={handleClose} variant="contained" sx={styles.backButton}>Go Back</Button>
        </Box>
    );

    // 4. Main Render
    return (
        <Box sx={styles.mainContainer}>
            <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 5 }, mb: { xs: 4, md: 5 } }}>
                <Paper elevation={20} sx={styles.detailPaper}>
                    
                    {/* ❌ CLOSE/BACK ICON (Top Right) */}
                    <Tooltip title="Close Details (Go Back)">
                        <IconButton 
                            onClick={handleClose} 
                            sx={styles.closeButton}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <Grid container spacing={{ xs: 4, md: 8 }}> 
                        
                        {/* === COLUMN 1: POSTER === */}
                        <Grid item xs={12} md={4} sx={styles.posterContainer}>
                            <Box 
                                component="img" 
                                src={movie.poster || posterFallback} 
                                alt={movie.title}
                                sx={styles.poster}
                                onError={(e) => { e.target.onerror = null; e.target.src = posterFallback; }}
                            />
                        </Grid>

                        {/* === COLUMN 2: DETAILS AND DESCRIPTION === */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={{ xs: 2.5, sm: 4 }}> 
                                
                                <Typography variant="h3" component="h1" sx={styles.title}>
                                    {movie.title}
                                </Typography>

                                {/* Metadata Chips */}
                                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                    <Chip 
                                        icon={<StarIcon />} 
                                        label={`Rating: ${movie.rating}`} 
                                        sx={styles.infoChip('gold')} 
                                    />
                                    <Chip 
                                        icon={<CalendarTodayIcon />} 
                                        label={`Year: ${movie.year}`} 
                                        sx={styles.infoChip(NEON_COLOR)} 
                                    />
                                    {movie.duration && (
                                        <Chip 
                                            icon={<AccessTimeIcon />} 
                                            label={movie.duration} 
                                            sx={styles.infoChip('#f06292')}
                                        />
                                    )}
                                     {movie.imdbRank && (
                                        <Chip 
                                            label={`#${movie.imdbRank} Rank`} 
                                            sx={styles.infoChip('lightgreen')} 
                                        />
                                    )}
                                </Stack>

                                <Divider sx={styles.divider} />

                                {/* Description */}
                                <Typography variant="h5" sx={styles.subtitle}>
                                    Overview
                                </Typography>
                                <Typography variant="body1" sx={styles.descriptionText}>
                                    {movie.description || "Description is not available for this movie."}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

// ----------------------------------------------------
// ⭐ Styles Object
// ----------------------------------------------------

const styles = {
    mainContainer: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f24 0%, #1c2b4e 100%)",
        color: "#fff",
    },
    detailPaper: {
        p: { xs: 4, sm: 6, md: 8 }, 
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${NEON_COLOR}33`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 15px 50px rgba(0,0,0,0.8), 0 0 20px ${NEON_COLOR}33`,
        position: 'relative',
    },
    
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        color: '#c7c7c7',
        zIndex: 10,
        fontSize: '1.5rem',
        '&:hover': {
            color: '#fff',
            bgcolor: `${NEON_COLOR}1A`,
            boxShadow: `0 0 12px ${NEON_COLOR}99`,
        },
    },

    posterContainer: {
        display: 'flex',
        justifyContent: 'center',
        mb: { xs: 2, md: 0 }, 
        order: { xs: 1, md: 0 },
    },
    poster: {
        width: '100%',
        maxWidth: 400,
        height: { xs: 450, md: 550 },
        objectFit: 'cover',
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        transition: '0.3s ease-out',
        '&:hover': {
            boxShadow: `0 12px 35px rgba(0,0,0,0.7), 0 0 20px ${NEON_COLOR}99`,
        }
    },
    title: {
        fontWeight: 900,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #0072ff)`,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
        lineHeight: 1.1,
    },
    subtitle: {
        fontWeight: 700,
        color: NEON_COLOR,
        fontSize: { xs: '1.2rem', sm: '1.5rem' },
    },
    descriptionText: {
        color: '#e0e0e0',
        fontSize: '1.05rem',
        lineHeight: 1.65,
    },
    infoChip: (color) => ({
        bgcolor: `${color}1A`,
        color: color,
        fontWeight: 600,
        py: 0.5,
        px: 1,
        height: 'auto',
        '& .MuiChip-icon': {
            color: color,
        }
    }),
    divider: {
        borderColor: 'rgba(255, 255, 255, 0.15)',
        mt: 2,
        mb: 2,
    },
    backButton: {
        background: NEON_COLOR,
        color: '#0a0f24',
        fontWeight: 'bold',
        '&:hover': { background: '#81ecec' }
    },
    statusContainer: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: NEON_COLOR,
        background: "linear-gradient(135deg, #0a0f24 0%, #1c2b4e 100%)",
    },
};