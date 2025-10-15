//AQUÍ SE UTILIZA EL CLIENT ID NO EL CLIENT NAME.

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function getComments(clientID, skip=0, limit=10, {authLogout, navigate}) {

    if(!clientID) {
        throw new Error('Debes seleccionar un cliente.')
    }
    try {
        const response = await fetch(`${FASTAPI_URL}/api/clients/${clientID}/comments?skip=${skip}&limit=${limit}`, {
            method: 'GET',
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
            throw new Error('No se han podido cargar los comentarios.');
        }

        return {
            comments: result
        }
    } catch(err) {
        console.error(err);
        if(err instanceof TypeError) {
            throw new Error('No se ha podido conectar con la API.')
        }
        throw err; //Levanta el error al próximo nivel.
    }
}