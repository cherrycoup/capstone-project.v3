import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, requireRole }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (requireRole && !requireRole.includes(user.role)) {
            navigate("/login");
        }

    }, [user, navigate, requireRole, loading]);

    // while checking
    if (loading || !user) return <div>Loading...</div>;

    // block unauthorized
    if (requireRole && !requireRole.includes(user.role)) return null;

    // ✅ allow access
    return children;
};

export default ProtectedRoutes;
