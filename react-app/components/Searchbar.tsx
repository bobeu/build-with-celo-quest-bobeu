import React from "react";

export const Searchbar = () => {
    const [searchIndex, setIndex] = React.useState<string>('0');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setIndex(value);
      } 

    return (
        <input 
            type="text" 
            name="Search" 
            id="asset" 
            placeholder="Search asset by name"
            className="bg-gray-100 p-2 rounded-lg border-2 border-gray-200 w-2/4 md:w-1/4 text-sm md:text-lg"
            onChange={(e) => handleSearch(e)}
        />
    )
}