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
        // bool isActive;
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
        bytes name;
        bytes symbol;
        uint8 decimals;
        address asset;
    }

    // struct PriceLimit {
    //     uint lower;
    //     uint upper;
    // }

    struct SupportedAsset {
        uint assetId;
        IER20 asset;
        bool isVerified;
    }

    // struct TradeRequest {
    //     uint quantity;
    //     uint price;
    //     StoreData request;

    // }

    function addItemToStoreFront(uint assetId, uint priceLimit) external returns(uint itemId);
    function createXWallet() external returns(bool);
    function buy(uint storeId, uint224 amount, uint offerPrice) external returns(bool);

    event ItemAdded(uint itemId, IERC20 asset, uint upper, uint lower);
    event ItemRemoved(uint itemId, IERC20 asset);
}