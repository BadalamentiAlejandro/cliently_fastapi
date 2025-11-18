import { useState } from "react";
import Modal from "../Modal";

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
                    className="p-2 m-1 bg-blue-700 rounded-md text-white w-[calc(20vw)]"
                    placeholder="Elige un cliente" />
                    <button type="submit" className="bg-blue-900 p-2 m-2 rounded-md hover:bg-blue-700 text-white transtition duration-500 ease-in-out hover:scale-110 min-w-fit">Buscar</button>
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