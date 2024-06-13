import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { LibrarianDashboard } from "../components/LibrarianDashboard"; // Import the LibrarianDashboard component

export const LibrarianHome = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mb={2}
            >
                <Typography variant="h4" component="h1">
                    Librarian Home
                </Typography>
                <Button onClick={handleLogout} variant="contained">
                    Logout
                </Button>
            </Box>
            <LibrarianDashboard /> {/* Render the LibrarianDashboard component */}
        </Box>
    );
};