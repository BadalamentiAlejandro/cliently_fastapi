import { useState, useEffect } from "react";
import Modal from "../Modal";

function AddClientButton({ addNewClient, ctx }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newClient, setNewClient] = useState(null);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        }

        // Se activa el eventListener al renderizarse el Modal.
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            // Al remover el eventListener se preoteje contra "Memory Leaks" y "Listeners Dumplicados".
            // Se desactiva por seguridad.
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    async function handleSubmit(e) {
        e.preventDefault()
        const inputValueName = e.target.newClientInput.value.trim("");
        const inputValueEmail = e.target.newClientEmail.value.trim("");
        const inputValuePhone = e.target.newClientPhone.value.trim("");

        const newCreateClient = await addNewClient(inputValueName, inputValueEmail, inputValuePhone, ctx);

        setNewClient(newCreateClient)
        setIsOpen(false);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Botón para abrir modal */}
            <button
            onClick={() => setIsOpen(true)}
            className="bg-stone-400 p-2 m-2 rounded-full hover:bg-stone-600 w-[calc(12vw)] hover:translate-x-5 transition ease-in-out duration-500"
            >
            Nuevo cliente
            </button>

            {/* Overlay + Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fondo negro con opacidad */}
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Contenido del modal */}
                    <div className="bg-transparent text-stone-200 rounded-lg shadow-lg z-10 w-md p-6 flex flex-col items-center justify-center">
                        <h2 className="text-xl font-bold mb-1">NUEVO CLIENTE</h2>

                        {/* Modal form for new client */}
                        <form className="flex flex-col w-full items-center"
                        onSubmit={handleSubmit}
                        >
                            <input type="text"
                            id="newClientInput"
                            name="newClientInput"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            placeholder="Introduce un nuevo cliente" />

                            <input type="text"
                            id="newClientEmail"
                            name="newClientEmail"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            placeholder="E-mail opcional" />

                            <input type="text"
                            id="newClientPhone"
                            name="newClientPhone"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            placeholder="Teléfono opcional" />
                            
                            <button type="submit"
                            className="bg-stone-600 p-2 m-2 rounded-full hover:bg-stone-700 transtition duration-500 ease-in-out hover:scale-110 min-w-fit"
                            >
                                Agregar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {newClient &&(
                <Modal cancelFunc={() => {setNewClient(null)}} text={`Cliente ${newClient.name} creado exitosamente`}/>
            )}
        </div>
    );
}


export default AddClientButton