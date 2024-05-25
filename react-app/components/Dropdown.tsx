import React from "react";
import { ToggleDrawer } from "./apis/readContract";

export const Dropdown: React.FC<{toggleDrawer: ToggleDrawer}> = ({toggleDrawer, }) => {

    return (
        <button onClick={toggleDrawer("left", true, "assetType")} className="bg-gray-100 p-2 flex justify-between items-center text-gray-400 rounded-sm border-2 border-gray-200 w-2/4 md:w-1/4 text-sm md:text-lg">
            <h3>Asset type</h3>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
        </button>
    )
}