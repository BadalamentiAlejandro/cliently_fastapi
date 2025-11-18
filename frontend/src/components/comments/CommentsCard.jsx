import ModifyCommentButton from "./ModifyCommentButton";
import DeleteCommentButton from "./DeleteCommentButton";

function CommentsCard({ comments, selectedClient, modFunction, delFunction, ctx }) {

    return(
        <div className="flex flex-col w-2xl">
            {comments.length === 0 || !selectedClient ? (
                <div className="flex flex-col m-1 rounded-md">
                    <p className="text-black pt-1 bg-stone-200 rounded-t-md min-h-[3rem] flex items-center justify-center">No hay comentarios</p>
                    <p className="flex items-center justify-end bg-stone-200 text-black rounded-b-md text-xs pb-1 px-1">
                        FECHA: Sin fecha.
                    </p>
                </div>
            ) : (
                comments.map((e) => {
                    return (
                        <div key={e.id} className="flex flex-col m-1 rounded-md">
                            <div className='flex flex-col rounded-md w-2xl'>
                                <p className="text-black pt-1 px-2 bg-stone-200 rounded-t-md min-h-[3rem] flex items-center justify-start whitespace-pre-wrap text-start">{e.text}</p>
                                <p className="flex items-center justify-end bg-stone-200 text-black rounded-b-md text-black text-xs pb-1 px-1">
                                    FECHA:{" "}
                                    {new Date(e.created_at).toLocaleDateString()}{" "}
                                    {new Date(e.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex flex-row items-center justify-end">
                                <ModifyCommentButton comment={e} selectedClient={selectedClient} modFunction={modFunction} ctx={ctx} />
                                <DeleteCommentButton comment={e} selectedClient={selectedClient} delFunction={delFunction} ctx={ctx} />
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default CommentsCard