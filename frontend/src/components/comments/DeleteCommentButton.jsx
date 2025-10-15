import { useState } from "react";
import Modal from "../Modal"

function DeleteCommentButton({ comment, selectedClient, delFunction, ctx }) {
    const [open, setOpen] = useState(false);

    async function handleDelete() {
        await delFunction(selectedClient.id, comment.id, ctx);
        setOpen(false);
    }

    return(
        <div>
            <button onClick={() => {setOpen(true)}} className="flex w-fit m-1 rounded-md bg-stone-400 p-2 hover:bg-red-600 hover:scale-110 ease-in-out transition duration-500">Borrar</button>

            {open &&(
                <Modal confirmFunc={handleDelete} cancelFunc={() => {setOpen(false)}} text={`Deseas eliminar el comentario: \n"${comment.text}"?`} />
            )}
        </div>
    )
}

export default DeleteCommentButton