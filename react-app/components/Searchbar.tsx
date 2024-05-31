import React from "react";

export const Searchbar: React.FC<{handleSearch: (arg: React.ChangeEvent<HTMLInputElement>) => void}> = ({handleSearch}) => {
    return (
        <input 
            type="text" 
            name="Search" 
            id="asset" 
            placeholder="Search asset by name"
            className="bg-gray-100 p-2 rounded-lg border-2 border-gray-200 w-2/4 md:w-1/4 text-xs text-stone-800 md:text-lg"
            onChange={(e) => handleSearch(e)}
        />
    )
}