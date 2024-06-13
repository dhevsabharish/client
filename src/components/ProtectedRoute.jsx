import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export const ProtectedRoute = ({ children }) => {
    const { token, logout } = useAuth();
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_RAILS_API_URL}/verify_token`, null, {
                    headers: { Authorization: token },
                });
            } catch (error) {
                console.error("Token verification failed:", error);
                logout();
                setIsTokenValid(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setIsTokenValid(false);
        }
    }, [token, logout]);

    if (!isTokenValid) {
        // Token is invalid or not present
        return <Navigate to="/login" />;
    }

    return children;
};