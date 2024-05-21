// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRegistry {
    error InvalidAssetId(uint assetId);
    error TokenBalanceInStoreTooLow();
    error NotPermitted();
    error InvalidStoreId();
    error AssetTransferFailed();

    struct StoreData {
        address asset;
        address seller;
        uint224 priceLimit;
        AssetMetadata metadata;
        StoreInfo info;
    }

    struct StoreInfo {
        uint quantity;
        uint assetId;
        uint storeId;
        // uint 
    }

    struct AssetMetadata {
        string name;
        string symbol;
        uint8 decimals;
    }

    struct SupportedAsset {
        uint assetId;
        IERC20 asset;
        bool isVerified;
    }

    struct WalletInfo {
        uint id;
        bool hasWallet;
    }

    struct Wallet {
        address owner;
        address xWallet;
    }

    function addItemToStoreFront(uint assetId, uint224 priceLimit) external returns(bool);
    function createXWallet() external returns(bool);
    function buy(uint storeId, uint224 amount, uint offerPrice) external returns(bool);
  
    event ItemAdded(uint itemId, IERC20 asset);
    event ItemRemoved(uint itemId, IERC20 asset);
}