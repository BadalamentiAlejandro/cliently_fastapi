import { createContext, useContext, useState, useEffect } from "react";
import { logout } from "../services/auth/deleteTokens";
import { verify } from '../services/auth/verifyTokens';
import { login as loginService } from '../services/auth/getTokens';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verifica token al montar la app
    useEffect(() => {
        async function checkAuth() {
            try {
                await verify(); // si no lanza error, el token es válido
                setIsAuthenticated(true);
            } catch (err) {
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
        } catch (err) {
            console.error("Error en logout:", err);
        } finally {
            setIsAuthenticated(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, authLogin, authLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// La función useAuth se utiliza para centralizar el contexto en un mismo método que nos va a ahorrar una importación en todos los componentes donde querramos usarlo. Ademas si quisieramos cambiar el nombre del contexto sería necesario cambiarlo en todos los componentes donde lo usemos, pero de esta manera no hace falta hacerlo ya que no utilizamos el nombre del contexto en los mismos.
// ejemplo de uso sin useAuth --> const { authLogout } = useContext(AuthContext);
// ejemplo de uso con useAuth --> const { authLogout } = useAuth();