import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage("token", null);
    const [userRole, setUserRole] = useLocalStorage("userRole", null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_RAILS_API_URL}/users/sign_in`, {
                user: { email, password },
            });
            // log response
            console.log(response);
            const authToken = response.headers.authorization;
            const role = response.data.data.role;
            setToken(authToken);
            setUserRole(role);
            // navigate("/");
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_RAILS_API_URL}/users`, {
                user: { email, password },
            });
            const authToken = response.headers.authorization;
            const role = response.data.data.role;
            setToken(authToken);
            setUserRole(role);
            // navigate("/");
            return true;
        } catch (error) {
            console.error("Signup failed:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_RAILS_API_URL}/users/sign_out`, {
                headers: { Authorization: token },
            });
            setToken(null);
            setUserRole(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, userRole, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
