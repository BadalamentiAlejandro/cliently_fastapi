import Modal from "../components/Modal"
import ClientsInputDataList from "../components/clients/ClientsInputDataList"
import AddClientButton from "../components/clients/AddClientButton"
import DeleteClientButton from "../components/clients/DeleteClientButton"
import ModifyClientButton from "../components/clients/ModifyClientButton"
import CommentsHeader from "../components/comments/CommentsHeader"
import CommentsTextArea from "../components/comments/CommentsTextArea"
import CommentsCard from "../components/comments/CommentsCard"
import LogoutButton from "../components/LogoutButton"
import useClients from "../hooks/useClients"
import useComments from "../hooks/useComments"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react"

function Dashboard() {
    const { authLogout } = useAuth();
    const navigate = useNavigate();

    const { clients, clientsError, loadClients, addNewClient, removeClient, modifyClient } = useClients();
    const [selectedClient, setSelectedClient] = useState();
    const [clientError, setClientError] = useState(null);


    const { comments, commentsError, loadComments, addNewComment, modifyComment, removeComment } = useComments();
    const [commentError, setCommentError] = useState(null);

    const [page, setPage] = useState(0);

    // El setState debe manejarse dentro de un useEffect o función de handleSubmit.
    useEffect(() => {
        if(clientsError) {
            setClientError(clientsError);
        }
    }, [clientsError]);

    useEffect(() => {
        if(commentsError) {
            setCommentError(commentsError);
        }
    }, [commentsError]);

    useEffect(() => {
        if(selectedClient) {
            loadComments(selectedClient.id, page, 10, { authLogout, navigate });
        }
    }, [selectedClient, page])

    // Carga clientes apenas se renderiza la página.
    useEffect(() => {
        loadClients({ authLogout, navigate });
    }, [])

    return(
        <div className="flex flex-nowrap font-sans overflow-hidden">
            {/* Left side with datalist client */}
            <div className="w-[calc(40vw)] h-screen overflow-hidden flex flex-nowrap flex-col font-sans items-center justify-evenly bg-gray-900">
                <ClientsInputDataList clients={clients} onSelect={setSelectedClient} />
                <AddClientButton addNewClient={addNewClient} ctx={{ authLogout, navigate }} />
                <ModifyClientButton selected={selectedClient} onSelect={setSelectedClient} modifyFunc={modifyClient} ctx={{ authLogout, navigate }} />
                <DeleteClientButton selected={selectedClient} onSelect={setSelectedClient} removeClient={removeClient} ctx={{ authLogout, navigate }} />
                <LogoutButton />
            </div>

            {/* Right side with comment cards */}
            <div className="w-screen h-screen overflow-auto flex flex-col font-sans items-center justify-start bg-cover bg-center bg-[url(././assets/landing2.jpg)]">
                <CommentsHeader clientName={selectedClient} />
                <CommentsTextArea client={selectedClient} addNewComment={addNewComment} ctx={{ authLogout, navigate }} />
                <CommentsCard
                    comments={comments}
                    selectedClient={selectedClient}
                    modFunction={modifyComment}
                    delFunction={removeComment}
                    ctx={{ authLogout, navigate }}
                />
                <div className="flex">
                    <button
                        className="flex w-fit m-1 rounded-md bg-stone-400 p-2 hover:bg-stone-600 hover:scale-110 ease-in-out transition duration-500"
                        disabled={page === 0}
                        onClick={() => {setPage(p => p - 10)}}
                    >
                        Anterior
                    </button>

                    <button
                        className="flex w-fit m-1 rounded-md bg-stone-400 p-2 hover:bg-stone-600 hover:scale-110 ease-in-out transition duration-500"
                        disabled={comments.length < 10}
                        onClick={() => {setPage(p => p + 10)}}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {clientError &&(
                <Modal cancelFunc={() => {setClientError(null)}} text={clientError} />
            )}

            {commentError &&(
                <Modal cancelFunc={() => {setCommentError(null)}} text={commentError} />
            )}
        </div>
    )
}

export default Dashboard