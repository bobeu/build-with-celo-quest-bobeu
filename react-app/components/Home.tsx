import React from "react";
import { Storage, StoreData } from "./apis/readContract";
import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import  from "@mui/material/Button";
import BottomDrawer, { Anchor } from "./BottomDrawer";
// import Button from "@mui/material/Button";

export const Home: React.FC<{mockStorage: Storage, searchText?: string}> = ({mockStorage, searchText}) => {
    const { stores, supportedAssets, xWallets } = mockStorage;
    const [state, setState] = React.useState({ bottom: false });
    const [selectedItem, setSelectedItem] = React.useState<StoreData>();
    
    const toggleDrawer =
        (anchor: Anchor, open: boolean, item?: StoreData) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
            ) {
            return;
            }
            item && setSelectedItem(item);
            setState({ ...state, [anchor]: open });
    };
        
    return (
        <Grid container spacing={2}>
            {
                stores.filter((item) => searchText? searchText === item.metadata.name : true)
                    .map((item, i) => (
                    <Grid item xs={4} md={3} className="" key={i}> 
                        <Stack onClick={toggleDrawer("bottom", true, item)} className="border-2 bg-stone-900 rounded-lg p-2 text-xs cursor-pointer text-green-100 font-serif self-stretch place-items-center hover:bg-stone-300 hover:text-orange-900 active:border-2 active:border-green-400">
                            <h3>{item.metadata.name}</h3>
                            <h3>{item.metadata.symbol}</h3>
                        </Stack> 
                    </Grid>
                ))
            }
            <BottomDrawer { ...{state, toggleDrawer, selectedItem} } />
        </Grid>
    )
}


// {
//     asset, info : { assetId, quantity, storeId }, metadata: { name, symbol, decimals }, priceLimit, seller
// }