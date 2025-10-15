import { useState, useEffect } from "react"
import Modal from "../Modal";


function ModifyClientButton({ selected, onSelect, modifyFunc, ctx }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [onSuccess, setOnSuccess] = useState(false);
    const [voidName, setVoidName] = useState(false);

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
            // Se desactiva para seguridad.
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    function handleSelected() {
        if(selected) {
            setIsOpen(true);
        } else {
            setIsSelected(true);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const inputValueName = e.target.newName.value.trim("");
        if(inputValueName === "") {
            setIsOpen(false)
            setVoidName(true);
            return
        }
        const inputValueEmail = e.target.newEmail.value.trim("");
        const inputValuePhone = e.target.newPhone.value.trim("");

        await modifyFunc(selected.name, inputValueName, inputValueEmail, inputValuePhone, ctx);
        setIsOpen(false);
        setOnSuccess(true);
        onSelect(null);
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <button
            onClick={handleSelected}
            className="bg-stone-400 p-2 m-2 rounded-full hover:bg-stone-600 w-[calc(12vw)] hover:translate-x-5 transition ease-in-out duration-500"
            >
                Modificar cliente
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
                        <h2 className="text-xl font-bold mb-1">Modificar {selected.name}</h2>   

                        {/* Modal form for new client */}
                        <form className="flex flex-col w-full items-center"
                        onSubmit={handleSubmit}
                        >
                            <input type="text"
                            id="newName"
                            name="newName"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            defaultValue={selected.name} />

                            <input type="text"
                            id="newEmail"
                            name="newEmail"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            defaultValue={selected?.email || ""} />

                            <input type="text"
                            id="newPhone"
                            name="newPhone"
                            autoComplete="off" 
                            className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-full"
                            defaultValue={selected?.phone || ""} />
                            
                            <button type="submit"
                            className="bg-stone-600 p-2 m-2 rounded-full hover:bg-stone-700 transtition duration-500 ease-in-out hover:scale-110 min-w-fit"
                            >
                                Cambiar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isSelected &&(
                <Modal cancelFunc={() => {setIsSelected(false)}} text={'Debes elegir un cliente para modificar.'} />
            )}

            {onSuccess &&(
                <Modal cancelFunc={() => {setOnSuccess(false)}} text={'Cliente modificado exitosamente.'} />
            )}

            {voidName &&(
                <Modal cancelFunc={() => {setVoidName(false)}} text={'El nombre del cliente no puede estar vacío.'} />
            )}
        </div>
    )
}

export default ModifyClientButton