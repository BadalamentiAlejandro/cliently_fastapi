import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRouteAdmin({ children }) {
    const { isAuthenticated, loading, user } = useAuth();

    if(loading) return null;

    if(!isAuthenticated) {
        return <Navigate to="/" replace/>
    }

    if(user.role !== "admin") {
        return <Navigate to ="/dashboard" replace/>
    }

    return children
}

export default ProtectedRouteAdmin