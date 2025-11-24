import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../Modal';

function DeleteUser({ selectedUser, setSelectedUser, deleteUser }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sucIsOpen, setSucIsOpen] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);

    const { authLogout } = useAuth();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        
        if(!selectedUser) {
            setErrorMessage("Debes elegir un usuario");
            return;
        }
        
        await deleteUser(selectedUser, {authLogout, navigate});
        setSelectedUser(null);
        setIsOpen(false)
        setSucIsOpen(true);
    }

    return(
        <div>
            <button className="bg-stone-500 p-2 m-2 hover:bg-stone-400 text-black rounded-md min-w-fit hover:scale-110 transition ease-in-out duration-500"
            onClick={() => setIsOpen(true)}>
                Delete
            </button>

            {/* Error handling */}
            {errorMessage &&(
                <Modal cancelFunc={() => {setErrorMessage(null)}} text={errorMessage} />
            )}

            {isOpen &&(
                <Modal confirmFunc={handleClick} cancelFunc={() => {setIsOpen(false)}} text={`Seguro deseas borrar permanentemente el usuario ${selectedUser.username}.`}/>
            )}

            {sucIsOpen &&(
                <Modal cancelFunc={() => {setSucIsOpen(false)}} text={'El usuario ha sido borrado exitosamente.'} />
            )}
        </div>
    )
}

export default DeleteUser;