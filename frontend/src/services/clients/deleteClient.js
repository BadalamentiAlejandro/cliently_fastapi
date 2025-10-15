const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function deleteClient(delClient, {authLogout, navigate}) {

    if(!delClient) {
        throw new Error('Debes especificar el nombre del cliente.');
    }

    try{
        const response = await fetch(`${FASTAPI_URL}/api/clients/${delClient.name}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if(!response.ok) {
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
            throw new Error('No se han podido borra el cliente.');
        }
        
        return {
            message: result,
        }

    } catch(err) {
        console.error(err);
        if(err instanceof TypeError) {
            throw new Error('No se ha podido conectar con la API.');
        }
        throw err;
    }
}