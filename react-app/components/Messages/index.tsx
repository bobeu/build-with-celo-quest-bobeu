import Box from "@mui/material/Box";
import React from "react";
import { OxString } from "../apis/contractAddress";

// To-do:  import socialConnect function that converts sellerAddress to phoneNumber

export default function Messages(props: {sellerToMesage: OxString | string}) {
    const { sellerToMesage } = props;
    return(
        <Box>
            <h3 className="text-xs">{`The beginning of your message with ${sellerToMesage}`}</h3>
            
        </Box>
    );
}