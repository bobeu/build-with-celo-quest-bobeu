import { waitForTransactionReceipt } from "wagmi/actions";
import { OxString, WagmiConfig } from "./contractAddress";
import { Callback, getData} from "./readContract";

export const waitForConfirmation = async(config: WagmiConfig, hash: OxString, account: OxString, callback?: Callback) => {
    await waitForTransactionReceipt(config, {hash});
    callback?.({txStatus: "Confirmed"});
    await getData({config, account, callback });
}