import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { CoinCategory, Supported, getBalance } from "../apis/readContract";
import { setApproval } from "../apis/setApproval";
import { useAccount, useConfig } from "wagmi";
import { OxString, formatAddr } from "../apis/contractAddress";
import { toBigInt } from "@/utilities";
import { addItemToStorefront } from "../apis/addItemToStorefront";
import { ethers } from "ethers";

export default function Sell({supportedAssets}: {supportedAssets: Supported}) {
    const [ selectedAsset, setSelected ] = React.useState<{name: string, assetContract: OxString, assetId: bigint}>();
    const [ displayAsset, setDisplay ] = React.useState<boolean>(false);
    const [ quantity, setQuantity ] = React.useState<string>();
    const [ priceLimit, setPriceLimit ] = React.useState<string>();
    const [ approvalDone, setApprovalDone ] = React.useState<boolean>(false);
    const [ loading, setLoading ] = React.useState<boolean>(false);
    const [ balance, setBalance ] = React.useState<string>("0");

    const { address : account} = useAccount();
    const config = useConfig();

    const handleSelectedAssetClick = async(option: {name: string, assetContract: OxString, assetId: bigint}) => {
        const { name, assetContract, assetId } = option;
        if(!account) return;
        setSelected({name, assetContract, assetId});
        setDisplay(false);
        await getBalance({config, account, contractAddr: assetContract})
            .then((result) => setBalance(ethers.utils.parseUnits(result.toString(), "ether").toString()));
    }

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
        e.preventDefault();
        const value = e.target.value;
        switch (tag) {
            case "price":
                setPriceLimit(value);
                break;
            case "quantity":
                setQuantity(value);
                break;
        
            default:
                break;
        }
    }

    const handleApprovalRequest = async() => {
        if(!selectedAsset?.assetContract) return;
        if(!quantity) return;
        if(!account) return;
        // if(!priceLimit) return;
        setLoading(true);
        await setApproval({
            config,
            account,
            amount: toBigInt(quantity),
            // callback,
            contractAddress: selectedAsset?.assetContract

        }).then(() => {
            setApprovalDone(true);
            setLoading(false);
        });
    }

    const handleCreateAd = async() => {
        if(!priceLimit) return;
        if(!selectedAsset?.assetId) return;
        if(!account) return;
        setLoading(true);
        await addItemToStorefront({
            config,
            account,
            priceLimit: toBigInt(priceLimit),
            assetId: selectedAsset?.assetId,

        }).then(() => {
            setApprovalDone(false);
            setLoading(false);
        });
    }

    return(
        <Box className="space-y-4">
            <Box className="flex justify-between items-center">
                <h3>Create your Ad</h3>
                <h3>{`Bal: ${balance} `}</h3>
            </Box>
            <Divider />
            <Box className="max-h-[200px] overflow-auto ">
                <button onClick={() => setDisplay(!displayAsset)} className="w-full bg-gray-100 p-2 flex justify-between items-center text-stone-800 rounded-sm border-2 border-gray-200 text-sm md:text-lg">
                    <h3>{selectedAsset?.name || "Pick Your Assets"}</h3>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </button>
                <div className="w-full" hidden={!displayAsset} >
                    {
                        supportedAssets?.map(({name, category, asset, assetId}, i) => (
                            <button key={i} onClick={async() => await handleSelectedAssetClick({name, assetContract: asset, assetId})} className="w-full flex justify-between items-center bg-white hover:bg-stone-300 text-xs p-4 border-2 border-stone-200 font-serif"
                            >
                                <h3>{ name }</h3>
                                <h3>{ CoinCategory[category] }</h3>
                            </button>
                        ))
                    }
                </div>
            </Box>
            <Box className="place-items-center">
                <Stack className="w-full space-y-2">
                    <h3>{"Quantity: "}</h3>
                    <div className="flex justify-between items-center gap-1">
                        <input 
                            type="number" 
                            name="Quantity" 
                            id="quantity" 
                            placeholder={`Quantity of ${selectedAsset?.name || 'asset'} you wish to sell`}
                            className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                            onChange={(e) => handleChangeEvent(e, "quantity")}
                        />
                        <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{quantity || '0'}</button>
                    </div>
                </Stack>
            </Box>
            <Box>
                {
                    selectedAsset && 
                        <button onClick={handleApprovalRequest} disabled={loading} className={`rounded-sm w-full border-2 border-stone-700 bg-stone-900 text-white p-2 hover:bg-stone-700 active:bg-stone-600 ${loading && "bg-opacity-10"}`}>
                            approve
                        </button>
                }
            </Box>
            <Box className="">
                {
                    approvalDone && 
                        <Stack className="w-full space-y-2">
                            <h3>{"Enter price: "}</h3>
                            <div className="flex justify-between items-center gap-1">
                                <input 
                                    type="number" 
                                    name="PriceLimit" 
                                    id="priceLimit" 
                                    placeholder={`Lowest price a unit of ${selectedAsset?.name || 'asset'} can go`}
                                    className="bg-gray-100 p-2 rounded-sm border-2 border-gray-200 w-full text-sm text-stone-800 md:text-lg"
                                    onChange={(e) => handleChangeEvent(e, "price")}
                                />
                                <button disabled className="w-[fit-content] bg-gray-100 border-2 border-gray-200 p-2 rounded-sm text-sm md:text-lg">{priceLimit || '0'}</button>
                            </div>
                        </Stack>
                }
            </Box>
            <Stack className="place-items-center">
                {
                    approvalDone && 
                        <button onClick={handleCreateAd} disabled={loading} className={`rounded-sm w-full border-2 border-stone-700 bg-stone-900 text-white p-2 hover:bg-stone-700 active:bg-stone-600 ${loading && "bg-opacity-10"}`}>
                            Create Ad
                        </button>
                }
            </Stack>
        </Box>
    )
}
