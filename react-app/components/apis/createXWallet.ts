import { writeContract, simulateContract } from "wagmi/actions";
import { Config } from "wagmi";
import { OxString, registry } from "./contractAddress";
import { waitForConfirmation } from "./waitForConfirmation";

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

export async function createXWallet(args: {config: Config, chainId: number, account: OxString}) {
  const { config, account, chainId } = args;
  const { request } = await simulateContract(config, {
    address: registry(chainId),
    account,
    abi: createWalletAbi,
    functionName: "createXWallet",
  });
  const hash = await writeContract(config, request ); 
  return await waitForConfirmation(config, hash, account, chainId);
}