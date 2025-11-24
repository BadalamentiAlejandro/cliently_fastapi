import { useState } from "react";
import { getUsers } from "../services/users/getUsers"
import { updateUsers } from "../services/users/updateUsers";
import { addUsers } from "../services/users/addUsers";
import { deleteUsers } from "../services/users/deleteUsers";

function useUsers() {
    const [ users, setUsers ] = useState([]);
    const [ usersError, setUsersError ] = useState(null);

    async function loadUsers(ctx) {
        try{
            setUsersError(null);
            const data = await getUsers(ctx);
            setUsers(data.users);
        } catch(err) {
            setUsersError(err.message);
            throw err;
        };
    }

    async function addUser(newUserName, newUserPassword, newUserRole, ctx) {
        try{
            setUsersError(null);
            const data = await addUsers(newUserName, newUserPassword, newUserRole, ctx);
            setUsers((prev) => [...prev, data.user]);
            return data.user;
        } catch(err) {
            setUsersError(err.message);
            throw err;
        }
    }

    async function modifyUser(username, updateUsername, updateRole, ctx) {
        try{
            setUsersError(null);
            const data = await updateUsers(username, updateUsername, updateRole, ctx);
            setUsers((prev) => prev.map((u) => u.username === username ? data.user : u));
            return data.user
        } catch(err) {
            setUsersError(err.message);
            throw err;
        }
    }

    async function deleteUser(username, ctx) {
        try{
            setUsersError(null);
            const data = await deleteUsers(username, ctx);
            setUsers((prev) => prev.filter((u) => u.username !== username));
            return data.message
        } catch(err) {
            setUsersError(err.message);
            throw err;
        }
    }

    return {
        users,
        usersError,
        loadUsers,
        addUser,
        modifyUser,
        deleteUser,
    }
}

export default useUsers;