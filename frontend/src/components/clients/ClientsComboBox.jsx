import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from "react";

function ClientsComboBox({ clients, selected, onSelect }) {
    const [ query, setQuery ] = useState("");
    const filteredClients =
    query === ''
        ? clients
        : clients.filter((client) => {
            return client.name.toLowerCase().includes(query.toLowerCase())
    })

    return(
        <div className="flex flex-col items-center w-full px-5">
            <div className="w-[calc(30vw)] overflow-hidden flex flex-nowrap flex-col font-sans items-center justify-evenly bg-blue-900">
                <div className="flex flex-col justify-evenly items-center w-full">
                    <Combobox value={selected} onChange={(value) => onSelect(value)} onClose={() => setQuery('')}>
                        <div className="relative flex flex-row items-center justify-between">
                            <ComboboxInput className="w-[calc(15vw)] bg-stone-300 m-2 p-2 rounded-md"
                                displayValue={(client) => client?.name}
                                placeholder="Selecciona un usuario"
                                onChange={(event) => setQuery(event.target.value)} />
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <ChevronDownIcon className="size-6 fill-black/60 group-data-hover:fill-black" />
                            </ComboboxButton>
                        </div>
                        <ComboboxOptions
                            anchor="bottom"
                            transition
                            className="bg-blue-700 text-black p-3 px-5 w-[calc(15vw)] rounded-md">
                                {filteredClients.map((client) => (
                                    <ComboboxOption
                                        key={client.id}
                                        value={client}>
                                            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 my-2 bg-blue-300 transition hover:scale-105 hover:bg-blue-500 ease-in-out duration-500 items-center justify-center">
                                                {client.name}
                                            </button>
                                    </ComboboxOption>
                                ))}
                        </ComboboxOptions>
                    </Combobox>
                </div>
            </div>
        </div>
    )
}

export default ClientsComboBox;