import { useState, useEffect } from "react";
import { logout } from "../services/auth/deleteTokens";
import { verify } from '../services/auth/verifyTokens';
import { login as loginService } from '../services/auth/getTokens';
import AuthContext from "../hooks/authContext";

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Verifica token al montar la app
    useEffect(() => {
        async function checkAuth() {
            try {
                const data = await verify(); // si no lanza error, el token es válido
                setUser(data);
                setIsAuthenticated(true);
            } catch (err) {
                console.warn(err)
                setIsAuthenticated(false); // si falla, no hay token válido
            } finally {
                setLoading(false)
            }
        }
        checkAuth();
    }, []);

    // login usando el servicio
    async function authLogin(username, password) {
        try {
            await loginService(username, password); // setea cookies en backend
            const data = await verify();
            setUser(data);
            setIsAuthenticated(true);
        } catch (err) {
            setIsAuthenticated(false);
            throw err;
        }
    }

    // logout usando servicio
    async function authLogout() {
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.error("Error en logout:", err);
        } finally {
            setIsAuthenticated(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, authLogin, authLogout, loading, user }}>
            {children}
        </AuthContext.Provider>
    );
}