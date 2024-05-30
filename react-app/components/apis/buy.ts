import { writeContract, simulateContract, multicall, MulticallParameters } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, registry } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback, CartItem, getBalance } from "./readContract";
import sendCUSD from "./sendCUSD";
import { bn } from "@/utilities";

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

const scrutinizeBalance = async({config, xWallet, account, costPriceInCUSD}:{config: Config, account: OxString, xWallet: OxString, costPriceInCUSD: bigint, }) : Promise<boolean> => {
  let canExecute = false;
  const balance = await getBalance({config, account: xWallet});
  if(bn(balance).lt(bn(costPriceInCUSD))){
    const topUp = bn(costPriceInCUSD).sub(bn(balance))
    const balSender = await getBalance({config, account});
    if(bn(balSender).gte(topUp)){
      await sendCUSD(xWallet, topUp.toBigInt())
        .then(() => canExecute = true );
    }
  } else { canExecute = true; }

  return canExecute;
} 

export async function buy(args: {config: Config, storeId: bigint, offerPrice: bigint, amountToBuy: bigint, xWallet: OxString, callback?: Callback, account: OxString, costPriceInCUSD: bigint}) {
  const { config, callback, account, xWallet, storeId, offerPrice, costPriceInCUSD, amountToBuy } = args;
  callback?.({txStatus: "Pending"});
  const canExecute = await scrutinizeBalance({config, account, xWallet, costPriceInCUSD});
  if(canExecute) {
    const { request } = await simulateContract(config, {
      address: registry,
      account,
      abi: buyItemAbi,
      functionName: "buy",
      args: [storeId, offerPrice, amountToBuy],
    });
    callback?.({txStatus: "Confirming"});
    const hash = await writeContract(config, request ); 
    await waitForConfirmation(config, hash, account, callback);
  } else { alert("Not enough balance")}
}

export async function sendBatchTransaction(
    config: Config, 
    account: OxString,
    xWallet: OxString,
    param: CartItem[]
) {
  const multicallParam : MulticallParameters = {
    allowFailure: true,
    contracts: param.map(
      (item) => {
        return {
          abi: buyItemAbi,
          address: registry,
          account,
          functionName: "buy",
          args: [item.storeId, item.offerPrice, item.amountToBuy]
        }
      }
    )
  }
  let costPriceInCUSD: bigint = 0n;
  param.forEach((item) =>{
    costPriceInCUSD = bn(costPriceInCUSD).add(bn(item.costPriceInCUSD)).toBigInt();
  } );
  console.log("costPriceInCUSD", costPriceInCUSD.toString())
  const canExecute = await scrutinizeBalance({config, account, xWallet, costPriceInCUSD});
  return canExecute && await multicall(config, multicallParam);
}
