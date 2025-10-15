

function CommentsHeader({ clientName }) {

    return(
        <div className="flex flex-col items-start">
            <div className="p-2 bg-stone-600 rounded-md border-2 w-2xl mt-[5vh] flex items-center justify-center">
                <p className="text-neutral-200 text-xl">{!clientName ? ('Seleciona un cliente de la lista.')
                : (clientName?.name)}</p>
            </div>
            <div className="bg-stone-600 rounded-md border-2 w-2xl flex items-center justify-center">
                <label className="px-2 ml-4 text-neutral-200">E-MAIL:</label>
                <p className="text-neutral-200 px-2 mr-4">{!clientName ? ('')
                : (clientName?.email)}</p>
            </div>
            <div className="bg-stone-600 rounded-md border-2 w-2xl flex items-center justify-center">
                <label className="px-2 ml-4 text-neutral-200">TELÉFONO:</label>
                <p className="text-neutral-200 px-2 mr-4">{!clientName ? ('')
                : (clientName?.phone)}</p>
            </div>
        </div>
    )
}

export default CommentsHeader