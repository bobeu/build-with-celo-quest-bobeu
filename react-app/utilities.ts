import { BigNumber } from "ethers";
import { zeroAddress } from "viem";

// export const inputStyle = {
//     width: "fit-content",
//     borderRadius: "6px",
//     background: "transparent",
//     border: "0.1rem solid #8ECDDD",
//     padding: "8px",^5.7.2
    
// }
    

export const str = (x: string | undefined) : string => {
    return String(x);
} 

export const bn = (x: string | bigint) => BigNumber.from(x);
export const toBigInt = (x: string | number) => BigNumber.from(x).toBigInt();
export const powr = (x: number | string, power: number, decimals: number): BigNumber => {
    return BigNumber.from(x).mul(BigNumber.from(BigNumber.from(10).pow(decimals))).mul(BigNumber.from(power));
  }