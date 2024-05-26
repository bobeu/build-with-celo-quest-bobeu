import React from "react";
import { Anchor, CoinCategory, HomeProps, InitStorage } from "./apis/readContract";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AllSideDrawer from "./AllSideDrawer";
import { bn, powr } from "@/utilities";
import { ethers } from "ethers";
import Address from "./Address";

const COIN_CATEGORY_STRING = new InitStorage().coinCategory;

export const Home: React.FC<HomeProps> = ({mockStorage, coinCategory, searchResult, toggleDrawer, removeFromCart, drawerState, contentType, activeLink, scrollToSection, items, selectedItem: si, addToCart, handleButtonClick}) => {
    const [ drawerContent, setDrawerContent ] = React.useState<React.ReactNode>();
    const [ amountToBuy, setAmountToBuy ] = React.useState<bigint>();
    const [ offerPrice, setOfferPrice ] = React.useState<bigint>();
    const { stores, supportedAssets, xWallets } = mockStorage;
    
    const boxWrapper = (anchor: Anchor, children: React.ReactNode) => (
        <Box
          sx={{ width: anchor === "bottom"? 'auto' : 200}}
          role="presentation"
        //   onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer("bottom", false, "")}
          className="p-4 place-items-center space-y-4"
        >
            { children }
        </Box>
    );

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
        e.preventDefault();
        const value = e.target.value;
        switch (tag) {
            case "offerPrice":
                setOfferPrice(powr(value, 1, 18).toBigInt());
                break;

            case "amountToBuy":
                setOfferPrice(powr(value, 1, 18).toBigInt());
                break;
        
            default:
                break;
        }
    }

    const selectedAsset = () => boxWrapper(
        "bottom",
        <React.Fragment>
            <Box className="text-sm">
                <h2 className="font-serif underline font-semibold text-md">Asset Information</h2>
                <div className="flex justify-between items-center">
                    <h3>Contract address</h3>
                    <Address display account={si?.asset} size={6} textSize="sm" />
                </div>
                <div className="flex justify-between items-center">
                    <h3>Asset Name</h3>
                    <h3>{si?.metadata.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Ticker</h3>
                    <h3>{si?.metadata.symbol}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Decimals</h3>
                    <h3>{si?.metadata.decimals}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Quantity Available</h3>
                    <h3>{ethers.utils.formatUnits(si?.info.quantity.toString(), "ether")}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Store ID</h3>
                    <h3>{si?.info.storeId.toString()}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Phone</h3>
                    <h3>{si.seller}</h3>
                </div>
            </Box>
            <Divider />
            <Stack>
                {/* Set amountToBuy */}
                <Stack className="w-full space-y-2 text-sm">
                    <h3>{`How many ${si.metadata.symbol} do you want to buy?`}</h3>
                    <div className="flex justify-between items-center gap-1">
                        <input 
                            type="number" 
                            name="AmountToBuy" 
                            id="amounttobuy" 
                            placeholder={`Enter amount to buy`}
                            className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "amountToBuy")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{amountToBuy?.toString() || '0'}</button>
                    </div>
                </Stack>
                {/* Set PriceLimit */}
                <Stack className="w-full space-y-2">
                    <h3>{`Amount you will offer per unit of ${si.metadata.symbol}`}</h3>
                    <div className="flex justify-between items-center gap-1">
                        <input 
                            type="number" 
                            name="OfferPrice" 
                            id="offerprice" 
                            placeholder={`Quantity of ${selectedAsset?.name || 'asset'} you wish to sell`}
                            className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "offerPrice")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{offerPrice?.toString() || '0'}</button>
                    </div>
                </Stack>
            </Stack>

            <Box className="flex justify-between items-center">
                <button onClick={() => scrollToSection("Messages", si.seller)} className="bg-orange-400 text-white border-2 border-green-400 rounded-sm text-sm p-1 float-right hover:bg-transparent  hover:text-stone-900">
                    Message Seller
                </button>
                <button onClick={() => {
                        if(si) {
                            if(!amountToBuy) return;
                            if(!offerPrice) return;
                            addToCart({item: si, amountToBuy, offerPrice});
                        }
                    }} 
                    className="bg-stone-800 text-white border-2 border-stone-700 rounded-sm text-sm p-1 float-right hover:bg-transparent  hover:text-stone-900"
                >
                    Add To Cart
                </button>
            </Box>
        </React.Fragment>
    );

    const cartContent = () => boxWrapper(
        "bottom",
        <Box>
            <Box className="flex justify-between items-baseline text-sm mb-2">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <button className="bg-stone-900 rounded-sm text-white p-2 border-2 border-stone-800 hover:bg-white hover:text-stone-900">Checkout</button>
            </Box>
            <Divider />
            <Box className="space-y-1 max-h-[300px] overflow-y-auto">
                {
                    items?.map((item, i) => (
                        <Box key={i} className="bg-stone-100 border-2 border-stone-200 rounded-sm p-2 flex justify-between items-center hover:bg-white cursor-pointer" >
                            <div className="w-3/4 flex justify-around gap-2 text-xs font-serif">
                                <h3>{ item.item.metadata.symbol }</h3>
                                <h3>{ item.item.priceLimit.toString() }</h3>
                            </div>
                            <button onClick={() => removeFromCart(item)} className="bg-stone-400 border-2 border-stone-400 rounded-sm w-1/4  text-white hover:bg-white hover:text-stone-900 active:bg-stone-500">x</button>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );

    const assetType = () => boxWrapper(
        "left",
        <Box>
            <Box className="mb-4">
                <h3 className="text-lg font-semibold">Asset Category</h3>
            </Box>
            <Divider />
            <Stack className="leading-4 place-items-start">
                {
                    COIN_CATEGORY_STRING.map((item) => (
                        <button key={item} onClick={() => handleButtonClick(item)} className={`w-3/4 p-2 rounded-sm hover:bg-opacity-80 text-left text-sm  ${coinCategory === item && "bg-stone-900 text-white"}`}>
                            { item }
                        </button>
                    ))
                }
            </Stack>
        </Box>
    );

    React.useEffect(() => {
        switch (contentType) {
            case "selectedAsset":
                setDrawerContent(selectedAsset());
                break;
            case "cartContent":
                setDrawerContent(cartContent());
                break;
            case "assetType":
                setDrawerContent(assetType());
                break;
            default:
                setDrawerContent(<></>);
                break;
        }
        
    }, [contentType, coinCategory, items, si]);

    return (
        <Box className="w-full ">
            <Grid container spacing={2}>
                {
                    stores.filter((item) => (coinCategory === "" || coinCategory === "ALL")? true : COIN_CATEGORY_STRING[item.metadata.category] === coinCategory)
                        .filter((item) => (!searchResult || searchResult === "")? true : (item.metadata.name === searchResult || item.metadata.symbol === searchResult))
                        .map((item, index) => (
                        <Grid item xs={4} md={3} key={index}> 
                            <Stack onClick={toggleDrawer("bottom", true, "selectedAsset", item)} className="border-2 bg-stone-900 rounded-sm p-2 text-xs cursor-pointer text-green-100 font-serif self-stretch place-items-center hover:bg-stone-300 hover:text-orange-900 active:border-2 active:border-green-400">
                                <Box className="w-full float-right font-mono px-2 text-center text-orange-200">
                                    <p style={{fontSize: "0.5rem"}}>{CoinCategory[item.metadata.category]}</p>
                                </Box>
                                <Box>
                                    <h3>{item.metadata.name}</h3>
                                    <h3>{item.metadata.symbol}</h3>
                                </Box>
                            </Stack> 
                        </Grid>
                    ))
                }
            </Grid>
            
            <AllSideDrawer { ...{ activeLink, scrollToSection, drawerState, toggleDrawer } }>
                { drawerContent }
            </AllSideDrawer>
        </Box>
    )
}

