import { useAuth } from "../hooks/useAuth";
import { Box, Button, Typography } from "@mui/material";

export const HomePage = () => {
    const { logout, token, userRole } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Display token in the console
    console.log("Bearer token:", token);
    // print user role
    console.log("User role:", userRole);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Home
            </Typography>
            <Button onClick={handleLogout} variant="contained" sx={{ mt: 3 }}>
                Logout
            </Button>
        </Box>
    );
};
