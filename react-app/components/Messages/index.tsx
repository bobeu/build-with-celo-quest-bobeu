import Box from "@mui/material/Box";
import React from "react";
import { OxString } from "../apis/contractAddress";
import { MOCK_PHONENUMBERS } from "../apis/readContract";
// To-do:  import socialConnect function that converts sellerAddress to phoneNumber

export default function Messages(props: {sellerToMesage: OxString | string}) {
    const { sellerToMesage } = props;
    return(
        <Box>
            <h3 className="text-xs">{`The beginning of your message with ${MOCK_PHONENUMBERS[0]}`}</h3>
            
        </Box>
    );
}