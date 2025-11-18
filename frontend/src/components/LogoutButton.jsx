import { useState } from "react";
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import shutDown from "../assets/shutDown.png";

function LogoutButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { authLogout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await authLogout(); // avisa al contexto y borra cookies
        navigate("/");  // redirige al login
    }

    return (
        <div className="flex flex-col items-center justify-end">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-900 p-2 m-2 hover:bg-blue-700 text-white rounded-md min-w-fit hover:scale-110 transition ease-in-out duration-500"
            >
                Salir
            </button>

            {isOpen && (
                <Modal
                    confirmFunc={handleLogout}
                    cancelFunc={() => setIsOpen(false)}
                    text="¿Deseas salir de la aplicación?"
                />
            )}
        </div>
    );
}

export default LogoutButton;
