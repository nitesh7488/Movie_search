import React, { useState } from "react";
import {
    TextField,
    Grid,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    InputAdornment,
    IconButton,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import API from "../api/api"; // Ensure API is imported

// Define the NEON_COLOR for consistency
const NEON_COLOR = "#38c5ff";

export default function Search() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const doSearch = async () => {
        if (!q.trim()) {
            setResults(null);
            return;
        }

        setLoading(true);
        try {
            // Ensure this API call is correctly configured in your project
            const res = await API.get(`/api/movies/search?q=${encodeURIComponent(q)}`);
            // Assuming res.data is the array of search results
            setResults(res.data); 
        } catch (error) {
            console.error("Search failed:", error);
            // Show empty results on failure, or handle error display if desired
            setResults([]); 
        } finally {
            setLoading(false);
        }
    };

    // ⭐ FIX 1: Reset both query and results when clearing input
    const handleClearInput = () => {
        setQ("");
        setResults(null); 
    };
    
    // This button navigates away from the search page
    const handleDismissSearch = () => {
        navigate('/'); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            doSearch();
        }
    };
    
    // --- Styling Functions (Kept for clarity) ---
    const inputBaseStyle = {
        color: "#fff",
        fontSize: "1.05rem",
        background: "rgba(255,255,255,0.07)",
        borderRadius: 2,
        height: 54,
        fontWeight: 500,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)", },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: NEON_COLOR, },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { 
            borderColor: NEON_COLOR,
            boxShadow: `0 0 8px ${NEON_COLOR}80`,
        },
    };

    const labelStyle = {
        color: "#9fb4c9",
        fontSize: "1rem",
        "&.Mui-focused": { color: NEON_COLOR, fontWeight: 600, },
    };

    // --- Rendering Logic ---
    const renderResultsContent = () => {
        if (loading) {
            return (
                <Box sx={styles.statusContainer}>
                    <CircularProgress sx={{ color: NEON_COLOR }} />
                    <Typography variant="h6" sx={{ mt: 2, color: '#bcd1e6' }}>Searching...</Typography>
                </Box>
            );
        }
        
        if (results === null) {
            // Initial state - only shown if results is explicitly null
            return (
                <Typography variant="h6" textAlign="center" sx={styles.initialMessage}>
                    Type something above to search for movies 🎬
                </Typography>
            );
        }

        if (results.length === 0) {
            // No results found message
            return (
                <Typography variant="h6" textAlign="center" sx={styles.initialMessage}>
                    Sorry, no results found for **"{q}"** 😔. Try another search!
                </Typography>
            );
        }

        return (
            <Grid container spacing={3} sx={styles.resultsGrid}>
                {results.map((m) => (
                    <Grid item key={m._id} xs={12} sm={6} md={4} lg={3}>
                        <MovieCard movie={m} />
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Box sx={styles.mainContainer}>
            
            <Paper elevation={12} sx={styles.searchPaper}>
                
                {/* Dismiss Button (X) */}
                <Tooltip title="Go Back to Home">
                    <IconButton 
                        onClick={handleDismissSearch} 
                        sx={styles.dismissButton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>

                <Typography variant="h4" textAlign="center" fontWeight="800" sx={styles.title}>
                    <SearchIcon sx={{ mr: 1, verticalAlign: 'middle', color: NEON_COLOR }} /> Search Movies
                </Typography>

                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {/* Search Input */}
                        <TextField
                            fullWidth
                            label="Search by title or description"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={handleKeyDown}
                            InputLabelProps={{ sx: labelStyle }}
                            InputProps={{ 
                                sx: inputBaseStyle,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: NEON_COLOR }} />
                                    </InputAdornment>
                                ),
                                endAdornment: q && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClearInput} edge="end" size="small" sx={styles.clearButton}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Search Button */}
                        <Button
                            variant="contained"
                            onClick={doSearch}
                            disabled={loading || !q.trim()}
                            sx={styles.searchButton}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Search'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* 3. Results / Status */}
            {renderResultsContent()}
        </Box>
    );
}


// ----------------------------------------------------
// ⭐ Styles Object
// ----------------------------------------------------
const styles = {
    mainContainer: {
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        background: "#0a0f24",
        color: "#fff",
    },
    searchPaper: {
        maxWidth: 650,
        mx: "auto",
        p: { xs: 3, sm: 4 },
        mb: 5,
        borderRadius: 4,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(14px)",
        animation: "fadeIn 0.5s ease-out",
        position: 'relative', 
    },
    
    dismissButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        color: '#ccc',
        transition: '0.3s',
        zIndex: 10,
        '&:hover': {
            color: NEON_COLOR,
            bgcolor: 'rgba(255,255,255,0.1)',
        }
    },
    
    title: {
        mb: 3,
        color: NEON_COLOR,
        letterSpacing: "0.5px",
        fontSize: { xs: "1.75rem", sm: "2.25rem" },
        pt: 1, 
    },
    searchButton: {
        width: { xs: "100%", sm: "auto" },
        px: 4,
        fontSize: "1.05rem",
        fontWeight: 700,
        borderRadius: 2,
        height: 54,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #0072ff)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "0.25s ease",
        "&:hover": {
            background: `linear-gradient(90deg, #49e8ff, #0084ff)`,
            transform: "translateY(-2px)",
        },
        "&.Mui-disabled": {
            background: '#444',
            color: '#aaa',
            transform: 'none',
            boxShadow: 'none',
        }
    },
    clearButton: { 
        color: NEON_COLOR,
        "&:hover": {
            color: '#fff',
            bgcolor: 'rgba(255,255,255,0.1)',
        }
    },
    statusContainer: {
        minHeight: '20vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 5,
    },
    initialMessage: {
        mt: 5,
        color: "#bcd1e6",
        animation: "fadeIn 0.5s ease-out",
    },
    resultsGrid: {
        mt: 1,
        animation: "fadeIn 0.6s ease-out",
        px: { xs: 1, md: 4 },
    }
};