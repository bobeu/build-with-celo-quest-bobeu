import React from "react";
import { Anchor, COIN_CATEGORY, CoinCategory, HomeProps, InitStorage, MOCK_PHONENUMBERS, getData } from "./apis/readContract";
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
import { createXWallet } from "./apis/createXWallet";
import Image from "next/image";

const COIN_CATEGORY_STRING = new InitStorage().coinCategory;

export const Home: React.FC<HomeProps> = ({mockStorage, storage, refresh, coinCategory, searchResult, toggleDrawer, removeFromCart, drawerState, contentType, activeLink, scrollToSection, items, selectedItem: si, addToCart, handleButtonClick}) => {
    const [ drawerContent, setDrawerContent ] = React.useState<React.ReactNode>();
    const [ amountToBuy, setAmountToBuy ] = React.useState<string>();
    const [ offerPrice, setOfferPrice ] = React.useState<string>();
    const storageInUse = storage? storage : mockStorage;
    const { stores, xWallets } = storageInUse;

    const { address : account, chainId } = useAccount();
    const config = useConfig();

    const handleCheckout = async() => {
        if(!account) return alert("Not Inside Minipay Wallet");
        if(!chainId) return alert("Wallet not ready");
        const { item: { info: {storeId}}, offerPrice, amountToBuy, costPriceInCUSD } = items[0];
        let xWallet = xWallets.filter((item) => item.owner.toLowerCase() === account.toLowerCase())?.at(0)?.xWallet;
        console.log("xWallet", xWallet);
        let canExecute = xWallet !== undefined;
        if(!canExecute) {
            await createXWallet({config, account, chainId})
                .then(() => {
                    canExecute = true;
                    refresh("We could not detect xWallet, so we created one for you");
                });
            await getData({config, account, chainId, callback: (result) => {
                xWallet = result.result?.xWallets.filter((item) => item.owner.toLowerCase() === account.toLowerCase())?.at(0)?.xWallet;
            } });
        }
        if(canExecute){
            const totalCost = bn(costPriceInCUSD).add(ethers.utils.parseUnits("0.1", "ether")).toBigInt();
            try {
                if(items.length === 1) {
                    console.log("chainId", chainId);
                    await buy({config, storeId, offerPrice, chainId, account, amountToBuy, xWallet: xWallet!, costPriceInCUSD: totalCost })
                        .then(() => removeFromCart(items[0]));
                } else {
                    console.log("Sending batch trx");
                    await sendBatchTransaction(config, account, xWallet!, chainId, items)
                        .then((result) => {
                            // console.log("Result", result);
                            for(let i = 0; i < items.length; i++) {
                                if(result?.at(i)?.status === "success") {
                                    removeFromCart(items[i]);
                                }
                            }
                        })
                }
                // items.forEach((item) => removeFromCart(item));
                refresh("Your trade was completed successfully");
            } catch (error: any) {
                console.log("Error", error?.message || error?.data.message);
            }
        }
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
            <Box className="text-sm font-serif  border-2 border-green-200 bg-green-100 rounded-lg p-2">
                <h2 className="underline font-semibold text-md">Asset Information</h2>
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
                    <h3>{`Min price per unit of ${si?.metadata.symbol}`}</h3>
                    <h3>{ethers.utils.formatEther(si?.priceLimit.toString())}</h3>
                </div>
                <div className="flex justify-between items-center">
                    <h3>Seller Contact</h3>
                    <h3>{MOCK_PHONENUMBERS[parseInt(si?.info.assetId.toString())]}</h3>
                </div>
            </Box>
            <Stack className="space-y-1">
                {/* Set amountToBuy */}
                <Stack className="font-serif w-full space-y-2 text-sm">
                    <h3 className="text-xs font-semibold">{`How many ${si.metadata.symbol} do you want to buy?`}</h3>
                    <div className="flex justify-between items-center gap-1 bg-gray-300 p-2 rounded-lg">
                        <input 
                            type="number" 
                            name="AmountToBuy" 
                            id="amounttobuy" 
                            placeholder={`Enter amount to buy`}
                            className="bg-green-100 p-2 rounded-lg border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "amountToBuy")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-lg text-sm md:text-lg">{amountToBuy || '0'}</button>
                    </div>
                </Stack>
                {/* Set PriceLimit */}
                <Stack className="font-serif w-full space-y-2">
                    <h3 className="text-xs font-semibold">{`OfferPrice (per unit of ${si.metadata.symbol.toLowerCase()})`}</h3>
                    <div className="flex justify-between items-center gap-1 bg-gray-300 p-2 rounded-lg">
                        <input 
                            type="number" 
                            name="OfferPrice" 
                            id="offerprice" 
                            placeholder={`Price you wish to pay`}
                            className="bg-green-100 p-2 rounded-lg border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "offerPrice")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-lg text-sm md:text-lg">{offerPrice || '0'}</button>
                    </div>
                </Stack>
            </Stack>

            <Box className="flex justify-between items-center font-serif gap-2">
                <button onClick={() => scrollToSection("Messages", si.seller)} className="bg-green-500 w-2/4 text-white rounded-lg text-sm p-2 float-right hover:bg-opacity-70 hover:text-stone-100 ">
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
                    className="bg-stone-800 text-white rounded-lg text-sm p-2 float-right w-2/4 hover:bg-opacity-70  hover:text-stone-300"
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
                <button onClick={handleCheckout} className="bg-stone-700 rounded-lg text-white p-2 border-2 border-stone-700 hover:bg-white hover:text-stone-900">Checkout</button>
            </Box>
            <Divider />
            <Grid container className="max-h-[300px] mb-1 overflow-y-auto">
                <Grid item container xs={12} spacing={2} className="bg-green-500 text-white font-semibold p-2">
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
                                        <button onClick={() => removeFromCart(item)} className="w-full bg-stone-700 border-2 border-stone-200 rounded-lg text-white hover:bg-white hover:text-stone-900 active:bg-stone-500">x</button>
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
            <Box className="mb-4 text-center bg-orange-400 p-4 text-white rounded-r-lg">
                <h3 className="text-lg font-semibold">Pick A Category</h3>
            </Box>
            {/* <Divider /> */}
            <Stack className="leading-4 place-items-start bg-white">
                {
                    COIN_CATEGORY_STRING.map((item) => (
                        <button key={item} onClick={() => handleButtonClick(item)} className={`w-3/4 p-2 rounded-sm hover:bg-opacity-80 text-left text-sm  ${coinCategory === item && "w-full text-center bg-stone-700 border-b-8 border-b-orange-400 text-white rounded-r-lg"}`}>
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
        // <Box className="max-h-[300px] w-full overflow-y-auto md:overflow-y-auto">
        <Box className="w-full space-y-1 max-h-[350px] overflow-y-auto md:overflow-y-auto">
            <Box className="w-full flex justify-between items-center gap-2 px-4">
                <Button 
                    variant="outlined"
                    sx={{fontSize: 10, display: "flex"}}
                >
                    <Image 
                        src={"/shoppingapp.svg"}
                        width={40}
                        height={40}
                        alt={"shoppingapp"}
                    />
                    How-to-buy

                </Button>
                <Button 
                    variant="outlined"
                    sx={{fontSize: 10, display: "flex"}}
                >
                    <Image 
                        src={"/emptycart.svg"}
                        width={40}
                        height={40}
                        alt={"shoppingapp"}

                    />
                    How-to-sell

                </Button>
            </Box>
            <Grid container spacing={2} className="px-4">
                {
                    stores.length > 0? stores.filter((item) => (coinCategory === "" || coinCategory === "ALL")? true : COIN_CATEGORY[item.metadata.category].id === coinCategory.toLowerCase())
                        .filter((item) => (!searchResult || searchResult === "")? true : (item.metadata.name.toLowerCase() === searchResult.toLowerCase() || item.metadata.symbol.toLowerCase() === searchResult.toLowerCase()))
                        .map((item, index) => (
                        <Grid item xs={6} md={3} key={index}> 
                            <Box onClick={toggleDrawer("bottom", true, "selectedAsset", item)} className="border-2 bg-stone-900 rounded-lg p-2 text-xs cursor-pointer text-green-100 font-semibold self-stretch flex justify-between items-center hover:bg-stone-300 hover:text-orange-900 active:border-2 active:border-green-400">
                                <Stack className="place-items-center">
                                    <p style={{fontSize: "0.5rem"}} className="font-mono text-orange-200">{COIN_CATEGORY[item.metadata.category].id}</p>
                                    <Image 
                                        src={COIN_CATEGORY[item.metadata.category].imageUrl}
                                        width={(COIN_CATEGORY[item.metadata.category].id === "meme" || COIN_CATEGORY[item.metadata.category].id === "defi")? 25 : 40}
                                        height={(COIN_CATEGORY[item.metadata.category].id === "meme" || COIN_CATEGORY[item.metadata.category].id === "defi")? 25 : 40}
                                        alt={"shoppingapp"}
                                        style={{borderRadius: "22px", width: "auto", height: "auto"}}
                                    />
                                </Stack>
                                <Stack className="place-items-end">
                                    <h3>{item.metadata.symbol}</h3>
                                    <h3>{`min/${ethers.utils.formatEther(item.priceLimit.toString())}`}</h3>
                                </Stack>
                            </Box> 
                        </Grid>
                    )) : <Grid item xs={12} >
                    <Box className="flex flex-col justify-center items-center border-2 bg-gray-200 text-gray-400 rounded-sm p-2 text-xs cursor-pointer font-serif self-stretch place-items-center hover:bg-stone-300 hover:text-orange-900 active:border-2 active:border-green-400">
                        <button className="w- p-2" onClick={() => scrollToSection("Sell")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </Box>
                </Grid>
                }
                
            </Grid>
            
            <AllSideDrawer { ...{ activeLink, scrollToSection, drawerState, toggleDrawer } }>
                { drawerContent }
            </AllSideDrawer>
        </Box>
    )
}

type Tag = "amountToBuy" | "offerPrice";