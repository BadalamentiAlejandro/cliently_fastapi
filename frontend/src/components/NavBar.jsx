// import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function NavBar() {
    const { user, loading, authLogout } = useAuth();
    const [ isOpen, setIsOpen ] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        await authLogout(); // avisa al contexto y borra cookies
        navigate("/");  // redirige al login
    }

    if(loading || !user) return null;

    const firstLetter = user?.username?.[0]?.toUpperCase();


    return(
        <div className="p-2 pr-7 flex flex-row justify-end items-center w-full">
            <div className="pr-3 text-black capitalize">{user?.username}</div>
            {/* <button className="flex items-center justify-center w-7 h-7 bg-blue-700 rounded-full text-white uppercase">
                {firstLetter}
            </button> */}
            <Menu>
                <MenuButton className="flex items-center justify-center w-7 h-7 bg-blue-700 rounded-full text-white uppercase hover:bg-blue-600 transition ease-in-out duration-500">
                    {firstLetter}
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-50 origin-top-right rounded-xl bg-gray-600 p-3 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0">
                    <MenuItem className="flex items-center justify-center">
                        <button className="w-15 h-15 bg-blue-700 rounded-full text-white text-2xl mx-auto mb-1 uppercase">
                                {firstLetter}
                        </button>
                    </MenuItem>
                        {user.role === "admin" &&(
                            <MenuItem>
                                <button
                                    onClick={() => navigate("/admindashboard")}
                                    className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 my-2 bg-blue-700 data-focus:bg-blue-600 transition hover:scale-105 ease-in-out duration-500 items-center justify-center">
                                        Admin
                                </button>
                            </MenuItem>
                        )}
                        <MenuItem>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 my-2 bg-blue-700 data-focus:bg-blue-600 transition hover:scale-105 ease-in-out duration-500 items-center justify-center">
                                    Dashboard
                            </button>
                        </MenuItem>

                        <MenuItem>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 my-2 bg-blue-700 data-focus:bg-blue-600 transition hover:scale-105 ease-in-out duration-500 items-center justify-center">
                                    Salir
                            </button>
                        </MenuItem>
                </MenuItems>
            </Menu>

            {isOpen &&(
                <Modal
                    confirmFunc={handleLogout}
                    cancelFunc={() => setIsOpen(false)}
                    text="¿Deseas salir de la aplicación?" />
            )}
        </div>
    )

}

export default NavBar