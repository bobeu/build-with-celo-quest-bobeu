import { createPublicClient, createWalletClient, custom, http, parseEther, stringToHex } from "viem";
import StableTokenABI from "./cUSD.json";
import { celoAlfajores, celo } from "viem/chains";
import { OxString } from "./contractAddress";

const isTestnet = true; 
// const isTestnet = false; 
const publicClient = createPublicClient({
  chain: isTestnet? celoAlfajores : celo,
  transport: http(),
});

export const getCUSD = () : OxString => {
  return "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
    // return "0x765de816845861e75a25fca122bb6898b8b1282a";
} 
export default async function sendCUSD(to: string, amount: bigint) {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: isTestnet? celoAlfajores : celo,
    });
    let [address] = await walletClient.getAddresses();
    console.log("Address", address);

    const tx = await walletClient.writeContract({
      address: getCUSD(),
      abi: StableTokenABI.abi,
      functionName: "transfer",
      account: address,
      args: [to, amount],
    });

    let receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    return receipt;
  
}