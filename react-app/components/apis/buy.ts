import { writeContract, simulateContract, multicall, MulticallParameters } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, registry } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback, CartItem, getBalance } from "./readContract";
import sendCUSD from "./sendCUSD";
import { bn } from "@/utilities";
import { ethers } from "ethers";

const buyItemAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "storeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "offerPrice",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

const scrutinizeBalance = async({config, xWallet, account, costPriceInCUSD, chainId}:{config: Config, account: OxString, xWallet: OxString, chainId: number, costPriceInCUSD: bigint, }) : Promise<boolean> => {
  let canExecute = false;
  const balance = await getBalance({config, account: xWallet, chainId });
  // console.log("balance", balance.toString());
  if(bn(balance).lt(bn(costPriceInCUSD))){
    const topUp = bn(costPriceInCUSD).sub(bn(balance));
    const balSender = await getBalance({config, account, chainId});
    if(bn(balSender).gte(topUp)){
      await sendCUSD(xWallet, topUp.toBigInt(), chainId)
        .then(() => canExecute = true );
    }
  } else { canExecute = true; }

  return canExecute;
} 

export async function buy(args: {config: Config, chainId: number, storeId: bigint, offerPrice: bigint, amountToBuy: bigint, xWallet: OxString, callback?: Callback, account: OxString, costPriceInCUSD: bigint}) {
  const { config, callback, account, xWallet, chainId, storeId, offerPrice, costPriceInCUSD, amountToBuy } = args;
  callback?.({txStatus: "Pending"});
  const canExecute = await scrutinizeBalance({config, account, xWallet, costPriceInCUSD, chainId});
  if(canExecute) {
    // console.log("offerPrice", offerPrice.toString())
    // console.log("amountToBuy", amountToBuy.toString())
    const { request } = await simulateContract(config, {
      address: registry(chainId),
      account,
      abi: buyItemAbi,
      functionName: "buy",
      args: [storeId, amountToBuy, offerPrice],
    });
    callback?.({txStatus: "Confirming"});
    const hash = await writeContract(config, request ); 
    await waitForConfirmation(config, hash, account, chainId, callback);
  } else { alert("Not enough balance")}
}

export async function sendBatchTransaction(
    config: Config, 
    account: OxString,
    xWallet: OxString,
    chainId: number,
    param: CartItem[]
) {
  const multicallParam : MulticallParameters = {
    allowFailure: true,
    contracts: param.map(
      (item) => {
        return {
          abi: buyItemAbi,
          address: registry(chainId),
          account,
          functionName: "buy",
          args: [item.storeId, item.offerPrice, item.amountToBuy]
        }
      }
    )
  }
  let costPriceInCUSD: bigint = 0n;
  param.forEach((item) =>{
    costPriceInCUSD = bn(costPriceInCUSD).add(bn(item.costPriceInCUSD)).add(ethers.utils.parseUnits("0.1", "ether")).toBigInt();
  });
  // console.log("costPriceInCUSD", costPriceInCUSD.toString());
  const canExecute = await scrutinizeBalance({config, chainId, account, xWallet, costPriceInCUSD});
  if(!canExecute) return;
  return await multicall(config, multicallParam);
}
