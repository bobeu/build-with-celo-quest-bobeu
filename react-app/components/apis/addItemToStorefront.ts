import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, registry } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback } from "./readContract";

const addItemAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceLimit",
        "type": "uint256"
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

export async function addItemToStorefront(args: {config: Config, priceLimit: bigint, assetId: bigint, callback?: Callback, account: OxString}) {
  const { config, callback, assetId, priceLimit, account } = args;
  callback?.({txStatus: "Pending"});
  const { request } = await simulateContract(config, {
    address: registry,
    account,
    abi: addItemAbi,
    functionName: "addItemToStoreFront",
    args: [assetId, priceLimit],
  });
  callback?.({txStatus: "Confirming"});
  const hash = await writeContract(config, request ); 
  return await waitForConfirmation(config, hash, account, callback);
}