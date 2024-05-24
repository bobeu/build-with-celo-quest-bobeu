import { zeroAddress } from "viem";
import { OxString, WagmiConfig, contractAddress } from "./contractAddress";
import { readContract } from "wagmi/actions";
import { toBigInt } from "@/utilities";

const address = contractAddress();
export const readDataAbi = [
  {
    "inputs": [],
    "name": "getData",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "asset",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "seller",
                "type": "address"
              },
              {
                "internalType": "uint224",
                "name": "priceLimit",
                "type": "uint224"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "symbol",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "decimals",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IRegistry.AssetMetadata",
                "name": "metadata",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "quantity",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "assetId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "storeId",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct IRegistry.StoreInfo",
                "name": "info",
                "type": "tuple"
              }
            ],
            "internalType": "struct IRegistry.StoreData[]",
            "name": "stores",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "assetId",
                "type": "uint256"
              },
              {
                "internalType": "contract IERC20",
                "name": "asset",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "internalType": "struct IRegistry.SupportedAsset[]",
            "name": "supportedAssets",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "xWallet",
                "type": "address"
              }
            ],
            "internalType": "struct IRegistry.Wallet[]",
            "name": "xWallets",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct IRegistry.Storage",
        "name": "stg",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getData = async(args: {config: WagmiConfig, account: OxString, callback: Callback}) => {
    const { config, account, callback } = args;
    const result : Storage = await readContract(config, {
        abi: readDataAbi,
        functionName: "getData",
        account,
        address
    });
    // return result;
    callback({result});
}

export type Status = "Pending" | "Confirming" | "Confirmed";
export type Callback = (args: {txStatus?: Status, result?: Storage}) => void;
export interface StoreInfo {
  quantity: bigint;
  assetId: bigint;
  storeId: bigint;
}

export interface AssetMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

export interface StoreData {
  asset: OxString;
  seller: OxString;
  priceLimit: bigint;
  metadata: AssetMetadata;
  info: StoreInfo;
}

export interface SupportedAsset {
  assetId: bigint;
  asset: string;
  isVerified: boolean;
}

export interface Wallet {
  owner: string;
  xWallet: string;
}

export type StoreFront = Readonly<StoreData[]>;
export type Supported = Readonly<SupportedAsset[]>;
export type XWallet = Readonly<Wallet[]>;

export interface Storage {
    stores: StoreFront;
    supportedAssets: Supported;
    xWallets: XWallet;
}

console.log("1", toBigInt('1'));
console.log("2", toBigInt('2'));
console.log("3", toBigInt('3'));
export class InitStorage {
  mockStorage: Storage;

  constructor() {
    this.mockStorage = {
      stores: [
      {
        asset: zeroAddress,
        info: {assetId: 0n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token0", symbol: "TNT0"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 1n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token1", symbol: "TNT1"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 2n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token2", symbol: "TNT2"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 3n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token3", symbol: "TNT3"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 4n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token4", symbol: "TNT4"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 5n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token5", symbol: "TNT5"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 6n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token6", symbol: "TNT6"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 7n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token7", symbol: "TNT7"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 8n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token8", symbol: "TNT8"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 9n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token9", symbol: "TNT9"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 10n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token10", symbol: "TNT10"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 11n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token11", symbol: "TNT11"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 12n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token12", symbol: "TNT12"},
        priceLimit: 0n,
        seller: zeroAddress
      },
      {
        asset: zeroAddress,
        info: {assetId: 13n, quantity: 0n, storeId: 0n},
        metadata: {decimals: 18, name: "Token13", symbol: "TNT13"},
        priceLimit: 0n,
        seller: zeroAddress
      },
    ],
      supportedAssets: [{asset: zeroAddress, assetId: 0n, isVerified: false}],
      xWallets: [{owner: zeroAddress, xWallet: zeroAddress}]
    }
  }
}