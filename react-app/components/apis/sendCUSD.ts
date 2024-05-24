import { createPublicClient, createWalletClient, custom, http, parseEther, stringToHex } from "viem";
import StableTokenABI from "./cUSD.json";
import { celoAlfajores, celo } from "viem/chains";
import { isTestnet } from "../../../hardhat/deploy/00_deploy";

const publicClient = createPublicClient({
  chain: isTestnet? celoAlfajores : celo,
  transport: http(),
});

export default async function sendCUSD(to: string, amount: bigint) {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: isTestnet? celoAlfajores : celo,
    });
    const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
    let [address] = await walletClient.getAddresses();
    console.log("Address", address);

    const tx = await walletClient.writeContract({
      address: cUSDTokenAddress,
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