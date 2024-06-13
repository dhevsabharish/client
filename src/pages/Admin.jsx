import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { LibrarianDashboard } from "../components/LibrarianDashboard";
import LibrarianList from "../components/LibrarianList";

export const AdminHome = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mb={2}
            >
                <Typography variant="h4" component="h1">
                    Admin Home
                </Typography>
                <Button onClick={handleLogout} variant="contained">
                    Logout
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
                <Box width="50%">
                    <LibrarianDashboard />
                </Box>
                <Box width="50%">
                    <LibrarianList />
                </Box>
            </Box>
        </Box>
    );
};