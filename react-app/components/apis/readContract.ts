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
                  },
                  {
                    "internalType": "enum IRegistry.Category",
                    "name": "category",
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
              },
              {
                "internalType": "enum IRegistry.Category",
                "name": "category",
                "type": "uint8"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
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

const getBalanceAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getData = async(args: {config: WagmiConfig, account: OxString, callback?: Callback}) => {
    const { config, account, callback } = args;
    const result : Storage = await readContract(config, {
        abi: readDataAbi,
        functionName: "getData",
        account,
        address
    });
    // return result;
    callback?.({result});
}

export const getBalance = async(args: {config: WagmiConfig, account: OxString, contractAddr: OxString }) => {
  const { config, account, contractAddr } = args;
    return await readContract(config, {
        abi: getBalanceAbi,
        functionName: "balanceOf",
        account,
        address: contractAddr,
        args: [account]
    });
}


//////////////////// INTERFACES //////////////////////////

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
  category: number;
}

export interface StoreData {
  asset: OxString;
  seller: OxString | string;
  priceLimit: bigint;
  metadata: AssetMetadata;
  info: StoreInfo;
}

export interface SupportedAsset {
  assetId: bigint;
  asset: OxString;
  isVerified: boolean;
  category: number;
  name: string;
}

export interface Wallet {
  owner: string;
  xWallet: string;
}

export interface FooterProps {
  scrollToSection: ScrollToSection;
  activeLink: SectionId;
}

export interface CartItem {
  amountToBuy: bigint;
  offerPrice: bigint;
  item: StoreData;
}

export interface HomeProps {
  mockStorage: Storage; 
  searchResult: string; 
  toggleDrawer: ToggleDrawer; 
  drawerState: DrawerState;
  coinCategory: string;
  contentType: ContentType; 
  activeLink: SectionId; 
  scrollToSection: ScrollToSection; 
  items: CartItem[]; 
  selectedItem: StoreData; 
  addToCart: (arg: CartItem) => void;
  removeFromCart: (arg: CartItem) => void;
  handleButtonClick: (arg: string) => void;
}

export interface HeaderProps {
  scrollToSection: ScrollToSection;
  handleSearch: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  activeLink: SectionId;
  toggleDrawer: ToggleDrawer;
  items: CartItem[];
}

export enum CoinCategory { "MEME", "NFT", "DEFI", "GOVERNANCE", "RWA", "GAMING", "YIELD", "SPORT", "PRIVACY", "METAVERSE", "ALL" }

export type StoreFront = Readonly<StoreData[]>;
export type Supported = Readonly<SupportedAsset[]>;
export type XWallet = Readonly<Wallet[]>;
export type ContentType = "cartContent" | "selectedAsset" | "assetType" | "";
export type Anchor = "top" | "left" | "bottom" | "right";
export type SectionId = "Home" | "Sell" | "Messages" | "Profile";
export interface ItemInfo {item: StoreData, index: number}
export type ToggleDrawer = (anchor: Anchor, open: boolean, cType: ContentType, item?: StoreData) => (event: React.KeyboardEvent | React.MouseEvent) => void
export type ScrollToSection = (arg: SectionId, seller?:OxString | string) => void; 
export interface Storage {
  stores: StoreFront;
  supportedAssets: Supported;
  xWallets: XWallet;
}

export interface DrawerState { 
  top: boolean; 
  left: boolean; 
  bottom: boolean; 
  right: boolean;
}

const MOCK_QUANTITY = [5000000000000000000000n, 7000000000000000000000n, 900000000000000000000n, 5590000000000000000000n, 56000000000000000000000n, 2240000000000000000000n, 1120000000000000000000n, 50000000000000000000n, 9910000000000000000000n, 230500000000000000000n] as const;
const MOCK_PRICELIMIT = [1000000000000000000n, 220000000000000000n, 10000000000000000000n, 900000000000000000n, 93000000000000000n, 50000000000000000000n, 1120000000000000000000n, 3000000000000000000n, 2055000000000000000n, 1200000000000000n] as const;
const MOCK_PHONENUMBERS = ["+2349026584667", "+3349026584667", "+9919026584667", "+8399026584667", "+1249026584667", "+2229026584667","+2349026584667", "+2349026584667", "+2349026584667", "+2349026584667"];

export class InitStorage {
  mockStorage: Storage;
  coinCategory: string[];
  mockSupportedAsset: {name: string, symbol: string}[];

  constructor() {
    this.mockSupportedAsset = ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const).map((i) => {
      return {name: `Token${i}`, symbol: `TNT${i}`}
    })
    this.coinCategory = ["MEME", "NFT", "DEFI", "GOVERNANCE", "RWA", "GAMING", "YIELD", "SPORT", "PRIVACY", "METAVERSE", "ALL"];
    this.mockStorage = {
      stores: ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] as const).map((i) => {
        return {
          asset: zeroAddress,
          info: {assetId: toBigInt(i), quantity: MOCK_QUANTITY[i], storeId: toBigInt(i)},
          metadata: {decimals: 18, name: `Token${i}`, symbol: `TNT${i}`, category: i},
          priceLimit: MOCK_PRICELIMIT[i],
          seller: MOCK_PHONENUMBERS[i]
        }
      }),
      supportedAssets: [{asset: zeroAddress, assetId: 0n, isVerified: false, category: CoinCategory.GAMING, name: "TNT1"}],
      xWallets: [{owner: zeroAddress, xWallet: zeroAddress}]
    }
  }
}