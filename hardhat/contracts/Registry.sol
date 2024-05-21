// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import { IRegistry } from "./interfaces/IRegistry.sol";
// import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzepplin/contracts/access/Ownable.sol";
import { IXWallet } from "./interfaces/IXWallet.sol";
import { XWallet } from "./XWallet.sol";

contract Registry is IRegistry, Ownable {
    address public cUSD;
    address public feeTo;

    SupportedAsset[] private supportedAssets;
    StoreData[] private storeFront;

    mapping (address => IXWallet) private xwallets;

    // Mapping of store Ids to rquested trades
    // mapping (uint => mapping(address => StoreData)) private requests;

    modifier isStoreOwner(uint storeId) {
        if(storeFront[storeId].seller != _msgSender()) {
            revert NotPermitted();
        }
        _;
    }

    modifier validateAssetId(uint assetId) {
        if(assetId >= supportedAssets.length) {
            revert InvalidAssetId(assetId);
        }
        require(supportedAssets[assetId].isVerified, "Asset disabled");
        _;
    }

    modifier validateStoreId(uint storeId) {
        require(_isStoreIdValid(storeId), "Invalid storeId");
        _;
    }

    constructor(IERC20[] memory _supportedAssets, address _cUSD) Ownable(msg.sender) {
        require(_cUSD != address(0), "invalid CUSD address");
        cUSD = _cUSD;
        for(uint i = 0; i < _supportedAssets.length; i++) {
            _setSupportedAsset(_supportedAssets);
        }
    }

    function _isStoreIdValid(uint storeId) internal returns(bool isValid) {
        isValid = storeId < storeFront.length
    }

    function _getAssetContract(uint assetId) internal view returns(IER20 assetContract) {
        assetContract = supportedAssets[assetId];
    }

    function _generateAssetId() private returns(uint assetId) {
        assetId = supportedAssets.length;
    }

    function _setSupportedAsset(IERC20 memory _supportedAssets) private {
        uint assetId = _generateAssetId();
        supportedAssets.push(SupportedAsset({
            assetId: assetId,
            asset: _supportedAssets,
            isVerified: true
        }));
    }

    ///@dev Tries to initializes a new xwallet 
    function createXWallet() external returns(bool) {
        address caller = _msgSender();
        if(xwallets[caller] == address(0)) {
            xwallets[caller] = address(new XWallet(cUSD, feeTo));
        }
    }

    /**@dev Add item to storeFront
     * @param assetId : Identifier for the verified asset listed on the frontend. This should correspond
     * to the id on the smart contract.
     * @param priceLimit: Lowest price at which trade should execute. Price should be denominated in cUSD
     * using 18 decimals. 
     * Example: If the price for an item is 0.1cUSD, it should be written as 1e17 wei or equivalently 100000000000000000 
     * otherwise, we will have a very inconsistent figures.
     */
    function addItemToStoreFront(uint assetId, uint224 priceLimit) external validateAssetId(assetId) returns(uint itemId) {
        IERC20 assetContract = _getAssetContract(assetId);
        address seller = _msgSender();
        address storeAddr = address(this);
        uint quantity = IERC20(assetContract).allowance(seller, storeAddr);
        uint storeId = storeFront.length;
        require(quantity > 0, "StoreFront: Quantity too low");
        storeFront.push(StoreData(
            address(assetContract),
            seller,
            priceLimit,
            // true,
            AssetMetadata(
                abi.encode(IER20(assetContract).name()),
                abi.encode(IER20(assetContract).symbol()),
                IER20(assetContract).decimals() 
            ),
            StoreInfo(quantity, assetId, storeId)
        ));

        emit ItemAdded(assetId, assetContract, upper, lower);
        require(IERC20(assetContract).transferFrom(seller, storeAddr, quantity));
        return true;
    }

    function editPriceLimit(uint storeId, uint224 newPriceLimit) external validateStoreId(storeId) isStoreOwner(storeId) returns(bool) {
        storeFront[storeId].priceLimit = newPriceLimit;
        return true;
    }

    function editSupportAsset(uint assetId, uint8 value) public onlyOwner validateAssetId(assetId) returns(bool) {
        supportedAssets[assetId].isVerified = value == 0? false : true;
        return true;
    }

    /**
     * @dev Executes trade on the instant. 
     * Note: Buyers maintain an internal wallet created automatically for them on signUp.
     * Buyer is expected to fund mapped wallet before initiating a trade otherwise execution fails. 
     * 
     * Offerprice should be specified in the same format as limitPrice
     */
    function _makePurchase(uint storeId, uint224 amount, address buyer, uint offerPrice) private {
        address xw = xwallets[buyer];
        require(xw != address(0), "No xWallet detected");
        if(_isStoreIdValid(storeId)) { 
            StoreData memory req = storeFront[storeId];
            require(offerPrice >= req.priceLimit, "OfferPrice too low");
            if(req.info.quantity >= amount) {
                uint256 amtToPay;
                uint fee = 1e17 wei;
                unchecked {
                    amtToPay = amount * offerPrice;
                }
                storeFront[storeId].info.quantity = req.info.quantity - amount;
                require(IERC20(cUSD).balanceOf(xw) >= (amtToPay + fee), "Insufficient bal in xw");
                require(IXWallet(xw).transferCUSD(req.seller, amtToPay, fee), "XWallet: Transfer failed");
                if(!IERC20(req.asset).transfer(buyer, amount)) {
                    revert AssetTransferFailed();
                }
            } else {
                revert TokenBalanceInStoreTooLow();
            }
        } else {
            revert InvalidStoreId();
        }
    }

    function buy(uint storeId, uint224 amount, uint offerPrice) external validateStoreId(storeId) returns(bool) {
        _makePurchase(storeId, amount, _msgSender(), offerPrice);
        return true;
    }











    function setSupportedAsset(IERC20 _asset) public onlyOwner returns(bool) {
        _setSupportedAsset(_asset);
        return true;
    }

    function unSupportAsset(IERC20 _asset, uint assetId) public onlyOwner validateAssetId(assetId) returns(bool) {
        supportedAssets[assetId].isVerified = false;
        return true;
    }
}