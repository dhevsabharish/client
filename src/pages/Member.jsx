import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";


export const MemberHome = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Member Home
            </Typography>
            <Button onClick={handleLogout} variant="contained" sx={{ mt: 3 }}>
                Logout
            </Button>
        </Box>
    );
};