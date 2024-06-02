import { createPublicClient, createWalletClient, custom, http, parseEther, stringToHex } from "viem";
import StableTokenABI from "./cUSD.json";
import { celoAlfajores, celo } from "viem/chains";
import { OxString } from "./contractAddress";

const configurePublicClient = (chainId: number) => {
  return createPublicClient({
    chain: chainId === 44787? celoAlfajores : celo,
    transport: http(),
  });
}

export const getCUSD = (chainId: number) : OxString => {
  return chainId === 44787? "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" : "0x765de816845861e75a25fca122bb6898b8b1282a";
} 

export default async function sendCUSD(to: string, amount: bigint, chainId: number,) {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: chainId === 44787? celoAlfajores : celo,
    });
    let [address] = await walletClient.getAddresses();

    const tx = await walletClient.writeContract({
      address: getCUSD(chainId),
      abi: StableTokenABI.abi,
      functionName: "transfer",
      account: address,
      args: [to, amount],
    });

    let receipt = await configurePublicClient(chainId).waitForTransactionReceipt({
      hash: tx,
    });

    return receipt;
  
}