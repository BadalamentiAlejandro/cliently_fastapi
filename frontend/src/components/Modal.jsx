import { useEffect } from "react";

function Modal({ confirmFunc, cancelFunc, text }) {

    useEffect(() => {
        function handleKeyDown(e) {
            if(!confirmFunc) {
                if ((e.key === "Escape") || (e.key === "Enter")) {
                    cancelFunc();
                }
            }
            if (e.key === "Escape") {
                cancelFunc();
            }
        }

        // Se activa el eventListener al renderizarse el Modal.
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            // Al remover el eventListener se preoteje contra "Memory Leaks" y "Listeners Dumplicados".
            // Se desactiva para seguridad.
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [cancelFunc]);

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo negro con opacidad */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={cancelFunc}
            ></div>

            {/* Contenido del modal */}
            <div className="bg-transparent text-stone-200 rounded-lg shadow-lg z-10 w-2xl p-6 flex flex-col items-center justify-center">
                <h2
                    className="text-xl font-bold mb-4"
                    style={{ whiteSpace: "pre-line" }}
                >
                    {text}
                </h2>
                {confirmFunc && (
                <div className="flex flex-row items-center justify-center">
                    <button
                    onClick={confirmFunc} 
                    className="bg-stone-600 p-2 m-2 rounded-full hover:bg-stone-700 min-w-fit transition duration-500 ease-in-out hover:scale-110"
                    >
                        Confirmar
                    </button>

                    <button 
                    onClick={cancelFunc}
                    className="bg-stone-600 p-2 m-2 rounded-full hover:bg-red-600 min-w-fit transition duration-500 ease-in-out hover:scale-110"
                    >
                    Cancelar
                    </button>
                </div>
                )}
            </div>
        </div>
    )
}

export default Modal