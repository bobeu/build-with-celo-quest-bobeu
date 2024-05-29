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
import { buy, sendBatchTransaction } from "./apis/buy";
import { useAccount, useConfig } from "wagmi";
import { zeroAddress } from "viem";

const COIN_CATEGORY_STRING = new InitStorage().coinCategory;

export const Home: React.FC<HomeProps> = ({mockStorage, refresh, coinCategory, searchResult, toggleDrawer, removeFromCart, drawerState, contentType, activeLink, scrollToSection, items, selectedItem: si, addToCart, handleButtonClick}) => {
    const [ drawerContent, setDrawerContent ] = React.useState<React.ReactNode>();
    const [ amountToBuy, setAmountToBuy ] = React.useState<string>();
    const [ offerPrice, setOfferPrice ] = React.useState<string>();
    const { stores, supportedAssets, xWallets } = mockStorage;

    const { address : account, } = useAccount();
    const config = useConfig();

    const handleCheckout = async() => {
        if(!account) return alert("Not Inside Minipay Wallet");
        const { item: { info: {storeId}}, offerPrice, amountToBuy, costPriceInCUSD } = items[0];
        const xWallet = xWallets.filter((item) => item.owner === account)?.at(0)?.xWallet;
        if(!xWallet) return;
        try {
            if(items.length === 1) {
                await buy({config, storeId, offerPrice, account, amountToBuy, xWallet, costPriceInCUSD })
            } else {
                await sendBatchTransaction(config, account, xWallet, items);
            }
            
        } catch (error: any) {
            console.log("Error", error?.message || error?.data.message);
        }
        refresh();
    }
    
    const boxWrapper = (anchor: Anchor, children: React.ReactNode) => (
        <Box
          sx={{ width: anchor === "bottom"? 'auto' : 200}}
          role="presentation"
        //   onClick={toggleDrawer(false)}
        //   onKeyDown={toggleDrawer("bottom", false, "")}
          className="p-4 place-items-center space-y-4"
        >
            { children }
        </Box>
    );

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, tag: Tag) => {
        e.preventDefault();
        const value = e.target.value;
        switch (tag) {
            case "offerPrice":
                setOfferPrice(value);
                // powr(value, 1, 18).toBigInt()
                break;

            case "amountToBuy":
                setAmountToBuy(value);
                // powr(value, 1, 18).toBigInt()
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
                    <h3 className="text-sm font-semibold">{`How many ${si.metadata.symbol} do you want to buy?`}</h3>
                    <div className="flex justify-between items-center gap-1">
                        <input 
                            type="number" 
                            name="AmountToBuy" 
                            id="amounttobuy" 
                            placeholder={`Enter amount to buy`}
                            className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "amountToBuy")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{amountToBuy || '0'}</button>
                    </div>
                </Stack>
                {/* Set PriceLimit */}
                <Stack className="w-full space-y-2">
                    <h3 className="text-sm font-semibold">{`OfferPrice (per unit of ${si.metadata.symbol.toLowerCase()})`}</h3>
                    <div className="flex justify-between items-center gap-1">
                        <input 
                            type="number" 
                            name="OfferPrice" 
                            id="offerprice" 
                            placeholder={`Price you wish to pay`}
                            className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "offerPrice")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{offerPrice || '0'}</button>
                    </div>
                </Stack>
            </Stack>

            <Box className="flex justify-between items-center">
                <button onClick={() => scrollToSection("Messages", si.seller)} className="bg-orange-400 text-white rounded-sm text-sm p-2 float-right hover:bg-opacity-70 hover:text-stone-900 ">
                    Message Seller
                </button>
                <button onClick={() => {
                        if(si) {
                            if(!amountToBuy) return;
                            if(!offerPrice) return;
                            const amtToBuy = powr(amountToBuy, 1, 18).toBigInt();
                            const price = ethers.utils.parseUnits(offerPrice, "ether").toBigInt();
                            addToCart({
                                item: si, 
                                amountToBuy: amtToBuy, 
                                offerPrice: price,
                                storeId: si.info.storeId,
                                costPriceInCUSD: bn(amtToBuy).mul(price).div(bn('10').pow(18)).toBigInt()
                            });
                        }
                    }} 
                    className="bg-stone-800 text-white rounded-sm text-sm p-2 float-right hover:bg-opacity-70  hover:text-stone-300"
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
                <button onClick={handleCheckout} className="bg-stone-700 rounded-sm text-white p-2 border-2 border-stone-700 hover:bg-white hover:text-stone-900">Checkout</button>
            </Box>
            <Divider />
            <Grid container className="max-h-[300px] mb-1 overflow-y-auto">
                <Grid item container xs={12} spacing={2} className="bg-stone-700 text-white font-semibold p-2">
                    {
                        (["Asset", "Qty", "Price", "Total"] as const).map((text) => (
                            <Grid item xs={2.5} key={text}>
                                <Box className="w-full text-sm text-start">
                                    <h3>{text}</h3>
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
                <Grid item container xs={12}>
                    {
                        items?.map((item, i) => (
                            <Grid item container xs={12} key={i} className="bg-stone-100 border-2 border-stone-200 rounded-sm p-2 flex justify-between items-center hover:bg-white cursor-pointer" >
                                <Grid item xs={2.5}>
                                    <Box className="text-xs font-serif">
                                        <h3>{ item.item.metadata.symbol }</h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box className="text-xs font-serif">
                                    <h3>{ ethers.utils.formatEther(item.amountToBuy.toString()) }</h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box className="text-xs font-serif">
                                        <h3>{ `$${ethers.utils.formatEther(item.offerPrice)} per ${item.item.metadata.symbol.toLowerCase()}` }</h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box className="text-xs font-serif">
                                        <h3>{ ethers.utils.formatEther(item.costPriceInCUSD).toString() }</h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box>
                                        <button onClick={() => removeFromCart(item)} className="w-full bg-red-500 border-2 border-stone-200 rounded-sm text-white hover:bg-white hover:text-stone-900 active:bg-stone-500">x</button>
                                    </Box>
                                </Grid>
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
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
        
    }, [contentType, coinCategory, items, si, amountToBuy, offerPrice]);

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

type Tag = "amountToBuy" | "offerPrice";