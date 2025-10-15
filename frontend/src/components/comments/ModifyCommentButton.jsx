import { useState, useEffect } from "react";
import Modal from "../Modal";

function ModifyCommentButton({ comment, selectedClient, modFunction, ctx }) {
    const [open, setOpen] = useState(false);
    const [emptyText, setEmptyText] = useState(false);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                if(emptyText) {
                    setEmptyText(false);
                } else if(open) {
                    setOpen(false);
                }
            }
        }

        // Se activa el eventListener al renderizarse el Modal.
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            // Al remover el eventListener se preoteje contra "Memory Leaks" y "Listeners Dumplicados".
            // Se desactiva para seguridad.
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, emptyText]);

    async function handleModify(e) {
        e.preventDefault();
        const inputValue = e.target.modComment.value.trim("");
        if(inputValue === "") {
            setEmptyText(true);
        } else {
            await modFunction(selectedClient.id, comment.id, inputValue, ctx)
            e.target.modComment.value = "";
            setOpen(false);
        }
    }

    // Función que dispara el handleSubmit con la tecla Enter en vez de dar un salto de linea.
    function handleKeyConfirm(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form.requestSubmit();
        }
    }

    return(
        <div>
            <button onClick={() => {setOpen(true)}} className="flex w-fit m-1 rounded-md bg-stone-400 p-2 hover:bg-stone-600 hover:scale-110 ease-in-out transition duration-500">Modificar</button>

            {/* Overlay + Modal */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fondo negro con opacidad */}
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={() => setOpen(false)}
                    ></div>

                    {/* Contenido del modal */}
                    <div className="bg-transparent text-stone-200 rounded-lg shadow-lg z-10 w-md p-6 flex flex-col items-center justify-center">
                        {/* Modal form for new client */}
                        <form className="flex flex-col w-full items-center"
                        onSubmit={handleModify}
                        >
                            <textarea 
                                name="modComment"
                                id="modComment"
                                placeholder="Modifica el comentario" 
                                className="bg-neutral-500 rounded-md w-md min-h-[6rem] resize-none m-1 p-1 flex items-center justify-center text-center"
                                onKeyDown={handleKeyConfirm}
                                defaultValue={comment.text}
                            >
                            </textarea>
                            
                            <button type="submit"
                            className="bg-stone-600 p-2 m-2 rounded-full hover:bg-stone-700 transtition duration-500 ease-in-out hover:scale-110 min-w-fit"
                            >
                                Cambiar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {emptyText &&(
                <Modal cancelFunc={() => {setEmptyText(false)}} text={"El comentario no puede estar vacío."} />
            )}
        </div>
    )
}

export default ModifyCommentButton