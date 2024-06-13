import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export const AdminHome = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
        >
            <Typography variant="h4" component="h1">
                Admin Home
            </Typography>
            <Button onClick={handleLogout} variant="contained">
                Logout
            </Button>
        </Box>
    );
};