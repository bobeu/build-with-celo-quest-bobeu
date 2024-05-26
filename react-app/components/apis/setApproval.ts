import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, contractAddress } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback } from "./readContract";

const approvalAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
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

export async function setApproval(args: {config: Config, amount: bigint, contractAddress: OxString, callback?: Callback, account: OxString}) {
    const { config, callback, amount, contractAddress,  account } = args;
    callback?.({txStatus: "Pending"});
    const { request } = await simulateContract(config, {
      address: contractAddress,
      account,
      abi: approvalAbi,
      functionName: "approve",
      args: [contractAddress, amount],
    });
    callback?.({txStatus: "Confirming"});
    const hash = await writeContract(config, request ); 
    return await waitForConfirmation(config, hash, account, callback);
  }