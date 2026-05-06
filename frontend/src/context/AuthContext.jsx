/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("pos-user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem("pos-user");
            return null;
        }
    });
    const [loading] = useState(false);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("pos-user", JSON.stringify(userData));
        localStorage.setItem("pos-token", token);
    }

    const updateUser = (updates) => {
        setUser((currentUser) => {
            const nextUser = { ...currentUser, ...updates };
            localStorage.setItem("pos-user", JSON.stringify(nextUser));
            return nextUser;
        });
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("pos-user");
        localStorage.removeItem("pos-token");
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
export default AuthProvider
