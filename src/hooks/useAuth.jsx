import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [token, setToken] = useLocalStorage("token", null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/users/sign_in", {
                user: { email, password }
            });
            const token = response.headers.authorization;
            setToken(token);
            setUser(response.data);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password");
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/users", {
                user: { email, password }
            });
            const token = response.headers.authorization;
            setToken(token);
            setUser(response.data);
            navigate("/");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed, please try again");
        }
    };

    const logout = async () => {
        try {
            await axios.delete("http://localhost:3000/users/sign_out", {
                headers: { Authorization: token }
            });
            setUser(null);
            setToken(null);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const value = useMemo(
        () => ({
            user,
            login,
            signup,
            logout,
            token
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
