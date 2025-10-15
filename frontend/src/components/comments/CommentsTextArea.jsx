import { useState } from "react";
import Modal from "../Modal"


function CommentsTextArea({ client, addNewComment, ctx }) {
    const [commentError, setCommentError] = useState(false);
    const [idError, setIdError] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const inputValue = e.target.addComment.value.trim("");
        if(!client) {
            setIdError(true);
        } else if(inputValue === "") {
            setCommentError(true);
        } else {
            await addNewComment(client.id, inputValue, ctx)
            e.target.addComment.value = "";
        }
    }

    // Función que dispara el handleSubmit con la tecla Enter en vez de dar un salto de linea.
    function handleKeyDown(e) {
        if(idError || commentError) return;

        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form.requestSubmit();
        }
    }

    return(
        <div>
            <form
                className="m-4 rounded-md flex flex-col items-end justify-center"
                onSubmit={handleSubmit}
            >
                <textarea 
                    name="addComment"
                    id="addComment"
                    placeholder="Agrega un comentario" 
                    className="bg-neutral-300 rounded-md w-2xl min-h-[6rem] resize-none m-1 p-2 flex items-center justify-center text-start placeholder:text-center"
                    onKeyDown={handleKeyDown}
                >
                </textarea>
                <button
                    type="submit"
                    className="flex w-fit m-1 rounded-md bg-stone-400 p-2 hover:bg-stone-600 hover:scale-110 ease-in-out transition duration-500"
                    disabled={!client}
                >
                    Guardar
                </button>
            </form>
            
            {idError &&(
                <Modal cancelFunc={() => {setIdError(false)}} text={"DEBES SELECCIONAR UN CLIENTE."} />
            )}

            {commentError &&(
                <Modal cancelFunc={() => {setCommentError(false)}} text={"DEBES ESCRIBIR UN COMENTARIO."} />
            )}
        </div>
    )
}

export default CommentsTextArea