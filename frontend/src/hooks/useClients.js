import { useState } from "react";
import { getClients } from "../services/clients/getClients";
import { addClient } from "../services/clients/addClient";
import { deleteClient } from "../services/clients/deleteClient";
import { updateClient } from "../services/clients/updateClient";

function useClients() {
    const [clients, setClients] = useState([]);
    const [clientsError, setClientsError] = useState(null);

    // Load all clients.
    async function loadClients(ctx) {
        try {
            setClientsError(null)
            const data = await getClients(ctx);
            //data es un objeto: .clients se usa para extraer el array y poder mappearlo con facilidad.
            setClients(data.clients); 
        } catch(err) {
            setClientsError(err.message);
            throw err;
        };
    }

    // Add new client.
    async function addNewClient(newClientName, newClientEmail, newClientPhone, ctx) {
        try{
            setClientsError(null);
            const data = await addClient(newClientName, newClientEmail, newClientPhone, ctx);
            setClients((prev) => [...prev, data.client]);
            return data.client
        } catch(err) {
            setClientsError(err.message);
            throw err;
        }
    }

    // Delete client.
    async function removeClient(clientDel, ctx) {
        try {
            setClientsError(null)
            const data = await deleteClient(clientDel, ctx);
            setClients((prev) => prev.filter((c) => c.name !== clientDel.name));
            return data.message
        } catch(err) {
            setClientsError(err.message)
            throw err;
        }
    }

    // Modify client.
    async function modifyClient(name, updateName, updateEmail, updatePhone, ctx) {
        try{
            setClientsError(null)
            const data = await updateClient(name, updateName, updateEmail, updatePhone, ctx);
            setClients((prev) => prev.map((c) => c.name === name ? data.client : c));
            return data.client
        } catch(err) {
            setClientsError(err.message);
            throw err;
        }
    }

    return {
        clients,
        clientsError,
        loadClients,
        addNewClient,
        removeClient,
        modifyClient,
    }
}

export default useClients;