import { useCallback, useEffect, useState } from "react";
import AuthContext from "./authContextValue";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthStatus = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");
            if (!token || !userString) {
                setUser(null);
                setIsAuthenticated(false);
                return;
            }

            const userData = JSON.parse(userString);
            if (!userData || !userData._id || !userData.role) {
                throw new Error("Stored user data is invalid");
            }
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(checkAuthStatus);
    }, [checkAuthStatus]);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    const updateUser = (updatedUserData) => {
        setUser((currentUser) => {
            const newUserData = { ...currentUser, ...updatedUserData };
            localStorage.setItem("user", JSON.stringify(newUserData));
            return newUserData;
        });
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
