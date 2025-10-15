import { useState } from "react";
import Modal from "../Modal";
import search from "../../assets/search.png"

function ClientsInputDataList ({ clients, onSelect }) {
    const [incorrectClient, setIncorrectClient] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        const inputValue = e.target.clientInput.value.trim("");

        //Busca si existe un cliente con ese nombre exacto.
        const selectedClient = clients.find(
            (client) => client.name.toLowerCase() === inputValue.toLowerCase()
        );

        if(selectedClient) {
            onSelect(selectedClient);
            setIncorrectClient(false);
            e.target.clientInput.value = ""; // Limpia el input.
        } else {
            setIncorrectClient(true);
            e.target.clientInput.value = "";
        }
    }

    return(
        <div className="flex flex-col items-center w-full px-5">
            <div className="flex flex-col md:flex-row w-full items-center">
                <form className="flex flex-col md:flex-row w-full items-center"
                onSubmit={handleSubmit}
                >
                    {/* Input works with datalist as one element binded by "list" in input and "id" in datalist */}
                    <input type="text"
                    id="clientInput"
                    name="clientInput"
                    autoComplete="off"
                    list="clientsList" 
                    className="p-2 m-1 border-2 border-black rounded-md bg-slate-400 text-black w-[calc(20vw)]"
                    placeholder="Elige un cliente" />
                    <button type="submit" className="bg-stone-400 p-2 m-2 rounded-full hover:bg-stone-600 transtition duration-500 ease-in-out hover:scale-110 min-w-fit"><img src={search} alt="Buscar" className="h-5 w-5" /></button>
                </form>

                <datalist id="clientsList">
                    {clients.map((e) => {
                        return <option key={e.id}>{e.name}</option>
                    })}
                </datalist>
            </div>

            {/* Error handling on wrong submit. */}
            {incorrectClient &&(
                <Modal cancelFunc={() => {setIncorrectClient(false)}} text='CLIENTE INCORRECTO' />
            )}
        </div>
    )
}

export default ClientsInputDataList