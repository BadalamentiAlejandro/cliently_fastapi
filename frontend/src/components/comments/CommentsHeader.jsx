

function CommentsHeader({ clientName }) {

    return(
        <div className="flex flex-col items-start">
            <div className="p-2 rounded-md w-2xl mt-[5vh] flex items-center justify-center">
                <p className="text-black text-xl">{!clientName ? ('Seleciona un cliente de la lista.')
                : (clientName?.name)}</p>
            </div>
            <div className="flex flex-row justify-between w-2xl">
                <div className="rounded-md w-s flex items-center justify-start">
                    <label className="text-black px-2">E-MAIL:</label>
                    <p className="text-black px-2 mr-4">{!clientName ? ('')
                    : (clientName?.email)}</p>
                </div>
                <div className="rounded-md w-s flex items-center justify-end">
                    <label className="text-black px-2">TELÉFONO:</label>
                    <p className="text-black px-2 mr-4">{!clientName ? ('')
                    : (clientName?.phone)}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentsHeader