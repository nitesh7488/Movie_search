import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    CircularProgress,
    Alert,
    Snackbar,
    IconButton, 
    Tooltip,    
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; 

import API from "../api/api";
import { useNavigate, useParams } from "react-router-dom";




const initialMovieState = {
    title: "",
    year: "",
    rating: "",
    duration: "",
    poster: "",
    description: "",
};

export default function AdminEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(initialMovieState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // 1. Fetch Movie Data
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming API.get('/api/movies') returns an array of movies
                const res = await API.get(`/api/movies`);
                const found = res.data.movies.find((m) => m._id === id);

                if (found) {
                    // Ensure number fields are initialized as strings for <TextField>
                    setMovie({
                        ...found,
                        year: String(found.year || ""),
                        rating: String(found.rating || ""),
                    });
                } else {
                    setError(`Movie with ID: ${id} not found.`);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Failed to load movie details. Check your network or API.");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    // 2. Input Change Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prev) => ({ ...prev, [name]: value }));
        // Clear validation error when the user starts typing
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // 3. Robust Client-Side Validation
    const validate = () => {
        let errors = {};
        const numericFields = ["year", "rating"];

        if (!movie.title.trim()) errors.title = "Title is required.";
        if (!movie.description.trim()) errors.description = "Description is required.";

        numericFields.forEach(field => {
            const value = movie[field];
            if (!value.trim()) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            } else if (isNaN(Number(value))) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a valid number.`;
            }
        });

        // Simple URL validation for poster
        if (movie.poster.trim() && !movie.poster.startsWith("http")) {
            errors.poster = "Poster URL must be a valid link.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 4. Submit Handler
    const submit = async () => {
        if (!validate()) {
            setSnackbar({
                open: true,
                message: "Please correct the highlighted errors before saving.",
                severity: "warning",
            });
            return;
        }

        
        
        const dataToSubmit = {
            ...movie,
            year: Number(movie.year),
            rating: Number(movie.rating),
        };

        try {
            await API.put(`/api/movies/${id}`, dataToSubmit);
            setSnackbar({
                open: true,
                message: "Movie Updated Successfully!",
                severity: "success",
            });
            
            setTimeout(() => navigate("/"), 1500); 
        } catch (err) {
            console.error("Update Error:", err);
            setSnackbar({
                open: true,
                message: "Failed to update movie. Server error.",
                severity: "error",
            });
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };
    
    // Handler for the Close button
    const handleClose = () => {
        navigate("/");
    };

    // 5. Conditional Rendering (Loading/Error States)
    if (loading) return <Box sx={styles.statusContainer}><CircularProgress color="inherit" /><Typography variant="h6" sx={{ mt: 2, color: "#fff" }}>Loading Movie Data...</Typography></Box>;
    if (error) return (
        <Box sx={styles.statusContainer}>
            <Alert severity="error" sx={{ maxWidth: 400, mb: 3 }}>{error}</Alert>
            <Button onClick={() => navigate("/")} variant="contained" sx={styles.backButton}>Go Back to Home</Button>
        </Box>
    );

    // 6. Main Form Render
    return (
        <Box sx={styles.mainContainer}>
            <Paper elevation={16} sx={styles.paperStyle}>
                
                {/* Close Button / Dismiss Icon */}
                <Tooltip title="Close (Go Back)">
                    <IconButton 
                        onClick={handleClose} 
                        sx={styles.closeButton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>

                <Typography variant="h4" sx={styles.titleStyle}>
                    🎬 Edit Movie Details
                </Typography>

                <Stack spacing={{ xs: 2.5, sm: 4 }} component="form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    
                    {/* Title Field */}
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        value={movie.title}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={inputGlow}
                        error={!!validationErrors.title}
                        helperText={validationErrors.title}
                        placeholder="e.g., The Matrix"
                    />

                    {/* Year & Rating Fields (Responsive Stack) */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2.5, sm: 3 }}>
                        <TextField
                            label="Year"
                            name="year"
                            fullWidth
                            value={movie.year}
                            onChange={handleChange}
                            InputLabelProps={labelStyle}
                            InputProps={inputGlow}
                            error={!!validationErrors.year}
                            helperText={validationErrors.year}
                            placeholder="e.g., 1999"
                        />

                        <TextField
                            label="Rating (0.0 to 10.0)"
                            name="rating"
                            fullWidth
                            value={movie.rating}
                            onChange={handleChange}
                            InputLabelProps={labelStyle}
                            InputProps={inputGlow}
                            error={!!validationErrors.rating}
                            helperText={validationErrors.rating}
                            placeholder="e.g., 8.7"
                        />
                    </Stack>

                    {/* Duration Field */}
                    <TextField
                        label="Duration"
                        name="duration"
                        fullWidth
                        value={movie.duration}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={inputGlow}
                        placeholder="e.g., 2h 36m"
                    />

                    {/* Poster URL Field */}
                    <TextField
                        label="Poster URL"
                        name="poster"
                        fullWidth
                        value={movie.poster}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={inputGlow}
                        error={!!validationErrors.poster}
                        helperText={validationErrors.poster}
                        placeholder="e.g., https://example.com/poster.jpg"
                    />

                    {/* Description Field */}
                    <TextField
                        label="Description"
                        name="description"
                        multiline
                        rows={6} 
                        fullWidth
                        value={movie.description}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={inputGlow}
                        sx={styles.descriptionInput} 
                        error={!!validationErrors.description}
                        helperText={validationErrors.description}
                        placeholder="A brief summary of the movie plot and themes."
                    />

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={styles.submitButton}
                    >
                        Save Changes
                    </Button>
                </Stack>
            </Paper>
            
            {/* User Feedback Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}


//  Reusable Styling Objects


const NEON_COLOR = "#6dd5fa"; 
const labelStyle = { style: { color: "#c7c7c7" } };

// Neon Glow Input Style (for TextField component)
const inputGlow = {
    sx: {
        color: "#fff",
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.2)",
            transition: "border-color 0.3s ease",
        },
        // Hover state
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON_COLOR,
        },
        // Focused state (Glow effect)
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON_COLOR,
            boxShadow: `0 0 16px ${NEON_COLOR}88`, 
            borderWidth: '2px', 
        },
        // Input text color
        "& .MuiInputBase-input": {
            color: "white",
        },
        // Error state color consistency
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f44336 !important", 
            boxShadow: "0 0 8px #f4433688",
        }
    },
};

// Component-specific styles
const styles = {
    mainContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        // Dark Blue/Purple Gradient Background
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        p: { xs: 2, sm: 4, md: 8 }, 
        pt: { xs: 4, sm: 6, md: 8 }, 
    },
    
    paperStyle: {
        width: "100%",
        maxWidth: 750, 
        p: { xs: 3, sm: 5, md: 7 }, 
        borderRadius: 4, 
        background: "rgba(255, 255, 255, 0.05)", 
        border: "1px solid rgba(255,255,255,0.1)", 
        backdropFilter: "blur(20px)", 
        color: "#fff",
        boxShadow: "0 10px 40px rgba(0,0,0,0.7)", 
        transition: "transform 0.3s ease",
        position: 'relative', 
        "&:hover": {
            transform: "translateY(-4px)", 
        }
    },
    
    // New style for the close button
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        color: '#c7c7c7', 
        zIndex: 10,
        '&:hover': {
            color: NEON_COLOR, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: `0 0 10px ${NEON_COLOR}88`,
        },
        
        m: { xs: 1, sm: 2 },
    },

    titleStyle: {
        fontWeight: "800",
        textAlign: "center",
        
        mb: { xs: 3, sm: 5 },
        pt: { xs: 1, sm: 0 }, 
        background: `linear-gradient(90deg, ${NEON_COLOR}, #2980b9)`,
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: { xs: "1.8rem", sm: "2.6rem" }, 
        letterSpacing: 1.5,
    },
    
    descriptionInput: {
        
        "& textarea": {
            color: "white !important", 
        },
    },
    
    submitButton: {
        mt: 3,
        py: 1.6,
        fontSize: { xs: "1.05rem", sm: "1.3rem" },
        fontWeight: "bold",
        borderRadius: 3,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #2980b9)`,
        boxShadow: `0 6px 30px ${NEON_COLOR}55`,
        transition: "0.3s ease",
        "&:hover": {
            background: `linear-gradient(90deg, #81ecec, ${NEON_COLOR})`,
            boxShadow: `0 8px 40px ${NEON_COLOR}99`,
            transform: "translateY(-3px)",
        },
    },

    statusContainer: {
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    },

    backButton: {
        background: NEON_COLOR,
        color: "#0f0c29",
        "&:hover": {
            background: "#81ecec",
        }
    }
};