const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function addClient(newClientName, newClientEmail, newClientPhone, {authLogout, navigate}) {

    if(!newClientName) {
        throw new Error('El cliente debe tener un nombre.');
    }

    try{
        const response = await fetch(`${FASTAPI_URL}/api/clients`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newClientName,
                email: newClientEmail,
                phone: newClientPhone}),
        });

        if(!response.ok) {
            if (response.status === 409) {
                throw new Error('Ya existe un cliente con ese nombre.');
            }
            if (response.status === 403) {
                throw new Error('Permisos insuficientes.')
            }
            if(response.status === 401) {
                await authLogout();
                navigate("/");
                throw new Error('Sesión expirada.')
            }
            throw new Error('Error en la petición a la Base de Datos.');
        }

        const result = await response.json();

        if(!result) {
            throw new Error('No se ha podido crear el cliente.');
        }

        return {
            client: result,
        }
    } catch(err) {
        console.error(err); 
        if(err instanceof TypeError){
            throw new Error('No se ha podido conectar con la API.');
        }
        throw err;
    }
}