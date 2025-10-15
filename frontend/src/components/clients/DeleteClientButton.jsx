import { useState } from "react"
import Modal from "../Modal";


function DeleteClientButton({ selected, onSelect, removeClient, ctx }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sucIsOpen, setSucIsOpen] = useState(false);
    const [warn, setWarn] = useState(false);

    function handleWarn() {
        if(!selected) {
            setWarn(true);
        } else {
            setIsOpen(true);
        }
    }

    async function handleSubmit() {
        await removeClient(selected, ctx);
        onSelect(null);
        setIsOpen(false)
        setSucIsOpen(true);
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <button
            className="bg-stone-400 p-2 m-2 rounded-full hover:bg-red-600 w-[calc(12vw)] hover:translate-x-5 transition ease-in-out duration-500"
            onClick={handleWarn}
            >
                Borrar cliente
            </button>

            {warn &&(
                <Modal cancelFunc={() => {setWarn(false)}} text={'Debes seleccionar un cliente para poder borrar.'} />
            )}

            {isOpen &&(
                <Modal confirmFunc={handleSubmit} cancelFunc={() => {setIsOpen(false)}} text={`Seguro deseas borrar permanentemente el cliente ${selected.name}.`}/>
            )}

            {sucIsOpen &&(
                <Modal cancelFunc={() => {setSucIsOpen(false)}} text={'El cliente ha sido borrado exitosamente.'} />
            )}
        </div>
    )
}

export default DeleteClientButton