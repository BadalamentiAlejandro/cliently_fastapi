const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function verify() {
    try{
        const response = await fetch(`${FASTAPI_URL}/api/auth/token/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        const result = await response.json();

        if(!response.ok) {
            throw new Error('Token expirado.');
        }

        return result;
        
    } catch(err) {
        console.error(err);
        if(err instanceof TypeError) {
            throw new Error('No se ha podido conectar con la API.');
        }
        throw err; //Esto levanta el error al proximo nivel para ser manejado.
    }
}