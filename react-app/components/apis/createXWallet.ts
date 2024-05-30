import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, registry } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";
import { Callback } from "./readContract";

const createWalletAbi = [
  {
    "inputs": [],
    "name": "createXWallet",
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

export async function createXWallet(args: {config: Config, account: OxString}) {
  const { config, account } = args;
  const { request } = await simulateContract(config, {
    address: registry,
    account,
    abi: createWalletAbi,
    functionName: "createXWallet",
  });
  const hash = await writeContract(config, request ); 
  return await waitForConfirmation(config, hash, account);
}