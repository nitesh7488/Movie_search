import React, { useState, useContext } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    Alert,
    CircularProgress,
} from "@mui/material";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


//  Reusable Style Constants



const NEON_COLOR = "#6dd5fa";

const InputLabelStyle = {
    sx: {
        color: "#9bb0c3",
        fontSize: "1rem",
        "&.Mui-focused": { color: NEON_COLOR },
        "&.Mui-error": { color: "#ff8a8a !important" } 
        
    },
};

const InputBaseStyle = (isError) => ({
    // Input field style
    sx: {
        color: "#fff",
        fontSize: "1rem",
        height: 50,
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
        px: 2,
        
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isError ? "#ff8a8a" : "rgba(255,255,255,0.15)", // Error state border
            transition: "border-color 0.3s ease",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: isError ? "#ff8a8a" : NEON_COLOR,
        },
        // Neon focus effect
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: isError ? "#ff8a8a" : NEON_COLOR,
            boxShadow: `0 0 10px ${isError ? "#ff8a8a" : NEON_COLOR}99`,
        },
    },
});

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({}); 

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Client-Side Validation Function
    const validate = () => {
        let errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            errors.email = "Invalid email format.";
        }

        if (!password.trim()) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // 2. Submit Handler
    const submit = async () => {
        if (!validate()) {
            setErrorMsg("Please correct the highlighted errors.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await API.post("/api/auth/login", { email, password });
            login(res.data);
            navigate("/");
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Invalid email or password.");
        }

        setLoading(false);
    };
    
    // 3. Input Change Handler
    const handleInputChange = (setter, field, value) => {
        setter(value);
        setErrorMsg(""); 
        setValidationErrors(prev => ({ ...prev, [field]: undefined })); 
        
    };

    // Allow submission via Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    };

    return (
        <Box sx={styles.mainContainer}>
            <Paper elevation={15} sx={styles.paperStyle}>
                
                {/* Title */}
                <Typography variant="h4" sx={styles.title}>
                    Login
                </Typography>

                {/* Error Box (Server/Validation Failure) */}
                {errorMsg && (
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={styles.errorAlert}
                    >
                        {errorMsg}
                    </Alert>
                )}

                <Stack spacing={3} component="form" onKeyDown={handleKeyDown} onSubmit={(e) => {e.preventDefault(); submit();}}>
                    
                    {/* Email */}
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => handleInputChange(setEmail, 'email', e.target.value)}
                        autoFocus
                        InputLabelProps={InputLabelStyle}
                        InputProps={InputBaseStyle(!!validationErrors.email)} 
                        error={!!validationErrors.email} 
                        helperText={validationErrors.email} 
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => handleInputChange(setPassword, 'password', e.target.value)}
                        InputLabelProps={InputLabelStyle}
                        InputProps={InputBaseStyle(!!validationErrors.password)} 
                        error={!!validationErrors.password} 
                        helperText={validationErrors.password} 
                    />

                    {/* Login Button */}
                    <Button
                        fullWidth
                        disabled={loading}
                        type="submit" 
                        variant="contained"
                        sx={styles.loginButton}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            "LOGIN"
                        )}
                    </Button>

                    {/* Register Link */}
                    <Typography
                        textAlign="center"
                        sx={styles.registerText}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            style={styles.registerLink}
                        >
                            Register
                        </Link>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}


//  Component-Specific Styles


const styles = {
    mainContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: { xs: 4, sm: 6 },
        background: "radial-gradient(circle at top, #10101a, #07070d)",
    },
    paperStyle: {
        width: "100%",
        maxWidth: 450,
        p: { xs: 4, sm: 5 },
        borderRadius: 4,
        background: "rgba(17, 25, 40, 0.65)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
        backdropFilter: "blur(20px)",
        color: "#fff",
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-3px)'
        }
    },
    title: {
        mb: 4,
        letterSpacing: 1,
        fontWeight: 900,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #1b9cfc)`,
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: { xs: "2rem", sm: "2.5rem" }
    },
    errorAlert: {
        mb: 3,
        borderRadius: 2,
        fontWeight: 600,
        background: "rgba(255,0,0,0.2)",
        color: "#fff",
        border: "1px solid #ff000055",
        boxShadow: "0 0 10px #ff000055"
    },
    loginButton: {
        mt: 1.5,
        py: 1.4,
        fontSize: "1.1rem",
        fontWeight: 900,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${NEON_COLOR}, #1b9cfc)`,
        boxShadow: "0 6px 25px rgba(0,0,0,0.6)",
        transition: ".25s ease",
        "&:hover": {
            background: "linear-gradient(90deg, #81ecec, #3498db)",
            transform: "translateY(-3px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
        },
        "&.Mui-disabled": {
            background: 'gray',
            color: '#ccc',
            transform: 'none',
            boxShadow: 'none',
            opacity: 0.8
        }
    },
    registerText: {
        mt: 2,
        color: "#bdbdbd",
        fontSize: "0.95rem"
    },
    registerLink: {
        color: NEON_COLOR,
        fontWeight: 700,
        textDecoration: "none",
        transition: "0.2s ease",
        "&:hover": {
            color: '#fff',
        }
    }
};