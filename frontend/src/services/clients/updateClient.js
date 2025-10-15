const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function updateClient(name, updateName, updateEmail, updatePhone, {authLogout, navigate}) {

    try{
        const response = await fetch(`${FASTAPI_URL}/api/clients/${name}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: updateName,
                email: updateEmail,
                phone: updatePhone}),
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
            throw new Error('No se ha podido modificar el cliente.');
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