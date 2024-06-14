import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Link, TextField, Typography, Paper } from "@mui/material";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate("/");
        } else {
            alert(result.message);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#f0f2f5', padding: 2 }}
        >
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Link component={RouterLink} to="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};
