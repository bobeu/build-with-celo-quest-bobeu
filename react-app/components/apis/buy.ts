import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, contractAddress } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback } from "./readContract";
import sendCUSD from "./sendCUSD";

const address = contractAddress();
const buyItemAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "storeId",
        "type": "uint256"
      },
      {
        "internalType": "uint224",
        "name": "amount",
        "type": "uint224"
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

export async function buy(args: {config: Config, storeId: bigint, offerPrice: bigint, amountToBuy: bigint, xWallet: OxString, callback?: Callback, account: OxString, costPriceInCUSD: bigint}) {
  const { config, callback, account, xWallet, storeId, offerPrice, costPriceInCUSD, amountToBuy  } = args;
  callback?.({txStatus: "Pending"});
  await sendCUSD(xWallet, costPriceInCUSD);
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: buyItemAbi,
    functionName: "buy",
    args: [storeId, offerPrice, amountToBuy],
  });
  callback?.({txStatus: "Confirming"});
  const hash = await writeContract(config, request ); 
  return await waitForConfirmation(config, hash, account, callback);
}