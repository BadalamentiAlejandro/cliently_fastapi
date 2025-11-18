import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import NavBar from "../components/NavBar";
import useUsers from '../hooks/useUsers';
import Modal from '../components/Modal';
import ModifyUser from '../components/users/ModifyUser';
import CreateUser from '../components/users/CreateUser';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AdminDashboard() {

    const { authLogout } = useAuth();
    const navigate = useNavigate();

    const { users, usersError, loadUsers, addUser, modifyUser } = useUsers();
    const [ selected, setSelected ] = useState(null);
    const [ incorrectUser, setIncorrectUser ]= useState(false);
    const [ userError, setUserError ] = useState(null);
    const [ query, setQuery ] = useState('')

    useEffect(() => {
        if(usersError) {
            setUserError(usersError);
        }
    }, [usersError])

    useEffect(()=> {
        loadUsers({authLogout, navigate});
    }, [selected])

    const filteredUsers =
        query === ''
            ? users
            : users.filter((user) => {
                return user.username.toLowerCase().includes(query.toLowerCase())
        })

    // console.log(selected)

    return(
        <div className="flex flex-nowrap font-sans overflow-hidden">
            {/* Left side */}
            <div className="w-[calc(30vw)] h-screen overflow-hidden flex flex-nowrap flex-col font-sans items-center justify-evenly bg-orange-400">
                <div className="flex flex-col justify-evenly items-center w-full">
                    <Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
                        <div className="relative flex flex-row items-center justify-between">
                            <ComboboxInput className="w-[calc(15vw)] bg-stone-300 m-2 p-2 rounded-md"
                                displayValue={(user) => user?.username}
                                placeholder="Selecciona un usuario"
                                onChange={(event) => setQuery(event.target.value)} />
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <ChevronDownIcon className="size-6 fill-black/60 group-data-hover:fill-black" />
                            </ComboboxButton>
                        </div>
                        <ComboboxOptions
                            anchor="bottom"
                            transition
                            className="bg-amber-300 text-black p-3 px-5 w-[calc(15vw)] rounded-md">
                                {filteredUsers.map((user) => (
                                    <ComboboxOption
                                        key={user.id}
                                        value={user}>
                                            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 my-2 bg-amber-100 transition hover:scale-105 hover:bg-amber-200 ease-in-out duration-500 items-center justify-center">
                                                {user.username}
                                            </button>
                                    </ComboboxOption>
                                ))}
                        </ComboboxOptions>
                    </Combobox>
                </div>

                {/* Datos de usuario */}
                <div className="flex flex-col">
                    <ol className='bg-stone-300 rounded-md p-5 flex flex-col justify-center items-start'>
                        <li className="p-2">Nombre: {selected ? selected.username : "Sin nombre"}</li>
                        <li className="p-2">Role: {selected ? selected.role : "Sin role"}</li>
                    </ol>
                </div>
            </div>
            
            {/* Right side */}
            <div className="w-screen h-screen overflow-auto flex flex-col font-sans items-center justify-start bg-cover bg-center bg-gray-300">
                <NavBar />
                <div className="w-full h-full flex flex-row justify-between items-center px-20">
                    <ModifyUser selectedUser={selected} setSelectedUser={setSelected} modifyUser={modifyUser} />
                    <CreateUser addUser={addUser} />
                </div>
            </div>

            {/* Error handling */}
            {userError &&(
                <Modal cancelFunc={() => {setUserError(null)}} text={userError} />
            )}

            {incorrectUser &&(
                <Modal cancelFunc={() => {setIncorrectUser(false)}} text='USUARIO INCORRECTO' />
            )}
        </div>
    )
}

export default AdminDashboard;