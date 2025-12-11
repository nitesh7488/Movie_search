import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    IconButton, // For the close button
    Tooltip,    // For the close button tooltip
    Snackbar,   // For notifications
    Alert,      // For notifications
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import API from "../api/api";
import { useNavigate } from "react-router-dom";


// Configuration & State

const NEON_COLOR = "#38c5ff";

const initialMovieState = {
    title: "",
    year: "",
    rating: "",
    duration: "",
    description: "",
    poster: "",
};

export default function AdminAdd() {
    const [movie, setMovie] = useState(initialMovieState);
    const [validationErrors, setValidationErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const navigate = useNavigate();

    // 1. Input Change Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prev) => ({ ...prev, [name]: value }));
        // Clear validation error when the user starts typing
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // 2. Client-Side Validation (Robust version)
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

        if (movie.poster.trim() && !movie.poster.startsWith("http")) {
            errors.poster = "Poster URL must be a valid link.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 3. Submit Handler
    const submit = async () => {
        if (!validate()) {
            setSnackbar({
                open: true,
                message: "Please fix the validation errors before submitting.",
                severity: "warning",
            });
            return;
        }

        // Prepare data for the API (convert numeric strings back to numbers)
        const dataToSubmit = {
            ...movie,
            year: Number(movie.year),
            rating: Number(movie.rating),
        };
        
        try {
            await API.post("/api/movies", dataToSubmit);
            setSnackbar({
                open: true,
                message: "Movie Added Successfully!",
                severity: "success",
            });
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error("Add Error:", err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Failed to add movie. Server error.",
                severity: "error",
            });
        }
    };

    // 4. Close/Navigation Handlers
    const handleClose = () => {
        navigate("/");
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    
    //  Styling Objects (Refined)
    

    const inputBaseStyle = {
        color: "#fff",
        fontSize: "1.05rem",
        fontWeight: 500,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 2,
        height: 54,
        px: 2,

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.18)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON_COLOR,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON_COLOR,
            boxShadow: `0 0 8px ${NEON_COLOR}80`,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
             borderColor: "#f44336 !important", 
             boxShadow: "0 0 8px #f4433688",
        }
    };

    const labelStyle = {
        style: { color: "#9fb4c9", fontSize: "1rem" },
        sx: { 
            "&.Mui-focused": { color: NEON_COLOR, fontWeight: 600 },
            "&.Mui-error": { color: "#f44336 !important" } // Error label color
        }
    };
    
    // --- JSX Rendering ---
    return (
        <Box sx={styles.mainContainer}>
            <Paper elevation={14} sx={styles.paperStyle}>
                
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
                    🎬 Add New Movie
                </Typography>

                <Stack spacing={3} component="form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    
                    {/* TITLE */}
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        value={movie.title}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={{ sx: inputBaseStyle }}
                        error={!!validationErrors.title}
                        helperText={validationErrors.title}
                    />
                    
                    {/* Responsive Stack for Year, Rating, Duration */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        
                        {/* YEAR */}
                        <TextField
                            label="Year"
                            name="year"
                            fullWidth
                            value={movie.year}
                            onChange={handleChange}
                            InputLabelProps={labelStyle}
                            InputProps={{ sx: inputBaseStyle }}
                            error={!!validationErrors.year}
                            helperText={validationErrors.year}
                        />

                        {/* RATING */}
                        <TextField
                            label="Rating (0.0 - 10.0)"
                            name="rating"
                            fullWidth
                            value={movie.rating}
                            onChange={handleChange}
                            InputLabelProps={labelStyle}
                            InputProps={{ sx: inputBaseStyle }}
                            error={!!validationErrors.rating}
                            helperText={validationErrors.rating}
                        />
                        
                        {/* DURATION */}
                        <TextField
                            label="Duration (e.g., 2h 15m)"
                            name="duration"
                            fullWidth
                            value={movie.duration}
                            onChange={handleChange}
                            InputLabelProps={labelStyle}
                            InputProps={{ sx: inputBaseStyle }}
                        />
                    </Stack>

                    {/* POSTER URL */}
                    <TextField
                        label="Poster URL"
                        name="poster"
                        fullWidth
                        value={movie.poster}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={{ sx: inputBaseStyle }}
                        error={!!validationErrors.poster}
                        helperText={validationErrors.poster}
                    />

                    {/* DESCRIPTION */}
                    <TextField
                        label="Description"
                        name="description"
                        multiline
                        rows={5}
                        fullWidth
                        value={movie.description}
                        onChange={handleChange}
                        InputLabelProps={labelStyle}
                        InputProps={{
                            sx: {
                                ...inputBaseStyle,
                                height: "auto",
                                alignItems: "flex-start",
                                paddingTop: "15px",
                                "& textarea": { color: "#fff !important" },
                            },
                        }}
                        error={!!validationErrors.description}
                        helperText={validationErrors.description}
                    />

                    {/* SUBMIT BUTTON */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={styles.submitButton}
                    >
                        Add Movie
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


// Component-Specific Styles


const styles = {
    mainContainer: {
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#0a0f24",
        p: { xs: 2, sm: 4, md: 6 },
        pt: { xs: 4, sm: 6, md: 8 },
    },
    
    paperStyle: {
        width: "100%",
        maxWidth: 700, 
        p: { xs: 3, sm: 5, md: 6 },
        borderRadius: 4,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(14px)",
        color: "#fff",
        boxShadow: "0 10px 40px rgba(0,0,0,0.55)",
        position: 'relative', 
        
        transition: "0.3s ease",
        "&:hover": {
            transform: "translateY(-4px)",
        }
    },
    
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
        mb: 4,
        pt: { xs: 1, sm: 0 }, 
        color: NEON_COLOR,
        letterSpacing: "0.5px",
        fontSize: { xs: "1.8rem", sm: "2.6rem" },
    },

    submitButton: {
        mt: 3,
        py: 1.5,
        fontSize: "1.1rem",
        fontWeight: 700,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #0072ff)`,
        boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
        transition: "0.3s ease",
        "&:hover": {
            background: `linear-gradient(90deg, #49e8ff, #0084ff)`,
            transform: "translateY(-3px)",
            boxShadow: "0 8px 26px rgba(0,0,0,0.55)",
        },
    },
};