import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import React from "react";

export default function Sell() {

    return(
        <Box className="space-y-4">
            <Box>
                <h3>Want to sell your digital asset?</h3>
            </Box>
            <Divider />
            <Box className="flex justify-between items-center">
                <Stack className="w-full space-y-2">
                    <h3>{"Enter price: "}</h3>
                    <input 
                        type="number" 
                        name="PriceLimit" 
                        id="priceLimit" 
                        placeholder={`Lower price a unit of  can go`}
                        className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                        // onChange={(e) => handleSearch(e)}
                    />
                </Stack>
            </Box>
            <Box className="">
                <button className="w-full bg-gray-100 p-2 flex justify-between items-center text-stone-800 rounded-sm border-2 border-gray-200 text-sm md:text-lg">
                    <h3>Pick Your Assets</h3>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </button>
            </Box>
        </Box>
    )
}
