import { Description, Field, Input, Label } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Modal from '../Modal';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function CreateUser({ addUser }) {
    const [ newUsername, setNewUsername ] = useState("");
    const [ newUserPassword, setNewUserPassword ] = useState("");
    const [ newUserRole, setNewUserRole ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const userRoles = ["admin", "responsible", "operator", "regular"]

    const { authLogout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!newUsername || !newUserRole || newUserPassword.length < 8) {
            setErrorMessage("Debes especificar nombre de usuario, contraseña de al menos 8 dígitos y role")
            return;
        }
        await addUser(newUsername, newUserPassword, newUserRole, {authLogout, navigate})
        setNewUsername("");
        setNewUserPassword("");
        setNewUserRole(null);
    }

    return(
        <div className="w-full max-w-md px-4">
            <form onSubmit={handleSubmit}>
                <Field id="modField" className="flex flex-col justify-center items-center">
                    <div className='flex flex-col justify-center items-center'>
                        <Label className="text-sm/6 font-medium text-black" htmlFor="newNameInput">Agregar un nuevo Usuario</Label>
                        {/* Nuevo nombre de usuario */}
                        <Input
                            id="newNameInput"
                            className="w-[calc(20vw)] bg-stone-500 m-2 p-2 rounded-md"
                            autoComplete='off'
                            placeholder="Nombre de usuario"
                            value={newUsername}
                            onChange={(event) => setNewUsername(event.target.value)}
                        />

                        {/* Nuevo password de usuario */}
                        <Input
                            id="passInput"
                            type="password"
                            className="w-[calc(20vw)] bg-stone-500 m-2 p-2 rounded-md"
                            autoComplete='off'
                            placeholder="Password para usuario"
                            value={newUserPassword}
                            onChange={(event) => setNewUserPassword(event.target.value)}
                        />
                    </div>

                    {/* Nuevo role de usuario */}
                    <div className='flex flex-col justify-center items-center w-full'>
                        <Description className="text-sm/6 text-black">Selecciona un nuevo role para el Usuario</Description>
                        <div className='w-full'>
                            <RadioGroup value={newUserRole} onChange={setNewUserRole} className="space-y-1">
                            {userRoles.map((role) => (
                                <Radio
                                key={role}
                                value={role}
                                className="group relative flex cursor-pointer rounded-lg bg-stone-500 m-2 px-3 py-2 text-black shadow-md transition focus:not-data-focus:outline-none data-checked:bg-stone-600 data-focus:outline data-focus:outline-white"
                                >
                                <div className="flex w-full items-center justify-between">
                                    <p className="text-black">{role}</p>
                                    <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-checked:opacity-100" />
                                </div>
                                </Radio>
                            ))}
                            </RadioGroup>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className='bg-stone-500 p-2 m-2 hover:bg-stone-400 text-black rounded-md min-w-fit hover:scale-110 transition ease-in-out duration-500'>
                        Aceptar
                    </button>
                </Field>
            </form>

            {/* Error handling */}
            {errorMessage &&(
                <Modal cancelFunc={() => {setErrorMessage(null)}} text={errorMessage} />
            )}
        </div>
    )
}

export default CreateUser;