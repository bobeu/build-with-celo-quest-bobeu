import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, contractAddress } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback } from "./readContract";

const address = contractAddress();
const addItemAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint224",
        "name": "priceLimit",
        "type": "uint224"
      }
    ],
    "name": "addItemToStoreFront",
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

export async function addItemToStorefront(args: {config: Config, priceLimit: bigint, assetId: bigint, callback: Callback, account: OxString}) {
  const { config, callback, assetId, priceLimit, account } = args;
  callback({txStatus: "Pending"});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: addItemAbi,
    functionName: "addItemToStoreFront",
    args: [assetId, priceLimit],
  });
  callback({txStatus: "Confirming"});
  const hash = await writeContract(config, request ); 
  return await waitForConfirmation(config, hash, account, callback);
}