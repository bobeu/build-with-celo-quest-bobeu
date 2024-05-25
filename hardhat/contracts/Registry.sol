// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "hardhat/console.sol";
import { IRegistry } from "./interfaces/IRegistry.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IXWallet } from "./interfaces/IXWallet.sol";
import { XWallet } from "./XWallet.sol";

contract Registry is IRegistry, Ownable {
    // CUSD address
    address public cUSD;

    // Fee receiver
    address public feeTo;

    ///@dev Supported assets
    SupportedAsset[] private supportedAssets;

    ///@dev Array of storeItems 
    StoreData[] private storeFront;

    // xWallet
    Wallet[] private xWallets;

    // Wallet Ids
    mapping(address => WalletInfo) private walletInfo;

    /**@dev Only Store owner function
     * @param storeId : item identifier or position in storage 
     */
    modifier isStoreOwner(uint storeId) {
        if (storeFront[storeId].seller != _msgSender()) {
            revert NotPermitted();
        }
        _;
    }

    /**@dev Ensures that uninitialize array slot is not accessed
     * @param assetId : Asset identifier or assset position in storage 
     */
    modifier validateAssetId(uint assetId) {
        if (assetId >= supportedAssets.length) {
            revert InvalidAssetId(assetId);
        }
        require(supportedAssets[assetId].isVerified, "Asset disabled");
        _;
    }

    /**@dev Ensures that uninitialize StoreFront array slot is not accessed
     * @param storeId : item identifier or position in storage 
     */
    modifier validateStoreId(uint storeId) {
        require(_isStoreIdValid(storeId), "Invalid storeId");
        _;
    }

    modifier validateCategoryId(uint8 categoryId) {
        require(categoryId < 10, "Unsupport asset id");
        _;
    }

    constructor(
        IERC20[] memory _supportedAssets,
        uint8[] memory _categories,
        address _cUSD,
        address _feeReceiver
    ) Ownable(msg.sender) {
        require(_cUSD != address(0) && _feeReceiver != address(0), _cUSD == address(0)? "invalid CUSD address" : "Invalid FeeReceiver");
        cUSD = _cUSD;
        feeTo = _feeReceiver;
        require(_categories.length == _supportedAssets.length, "Length mismatch");
        for (uint i = 0; i < _supportedAssets.length; i++) {
            _setSupportedAsset(_supportedAssets[i], _categories[i]);
        }
    }

    /**
     * @dev Internal function : Validate store Id
     * @param storeId : Item id
     */
    function _isStoreIdValid(uint storeId) internal view returns (bool isValid) {
        isValid = storeId < storeFront.length;
    }

    /**
     * @dev Retrieves asset from position { assetId }
     * @param assetId : Asset position in storage
     */
    function _getAssetContract(
        uint assetId
    ) internal view returns (IERC20 assetContract, Category category) {
        assetContract = supportedAssets[assetId].asset;
        category = supportedAssets[assetId].category;
    }

    /**
     * @dev Generates new asset Id
     */
    function _generateAssetId() private view returns (uint assetId) {
        assetId = supportedAssets.length;
    }

    /**
     * @dev Internal function: Set a new supported asset
     * @param _supportedAssets : ERC20 standard asset to support.
     */
    function _setSupportedAsset(IERC20 _supportedAssets, uint8 categoryId) private {
        uint assetId = _generateAssetId();
        supportedAssets.push(
            SupportedAsset({
                assetId: assetId,
                asset: _supportedAssets,
                isVerified: true,
                category: Category(categoryId)
            })
        );
    }

    /**
     * @dev Initializes a new xwallet
     */
    function createXWallet() external returns (bool) {
        address caller = _msgSender();
        WalletInfo memory wif = walletInfo[caller];
        if (!wif.hasWallet) {
            walletInfo[caller] = WalletInfo(xWallets.length, true);
            address newXWallet = address(new XWallet(cUSD, feeTo)); 
            xWallets.push(Wallet(caller, newXWallet));
        } else { revert("XWallet exist"); }
        return true;
    }

    /**@dev Add item to storeFront
     * @param assetId : Identifier for the verified asset listed on the frontend. This should correspond
     * to the id on the smart contract.
     * @param priceLimit: Lowest price at which trade should execute. Price should be denominated in cUSD
     * using 18 decimals.
     * Example: If the price for an item is 0.1cUSD, it should be written as 1e17 wei or equivalently 100000000000000000
     * otherwise, we will have a very inconsistent figures.
     * 
     * Note: Sellers are required to pay fees in CUSD as a prerequisite to adding asset to storeFront.
     *       Seller should fund their onchain Wallet before making this call.
     *       =========== THIS IS FUNCTION RESERVED TO BE IMPLEMENTED IN THE FUTURE==============
     */
    function addItemToStoreFront(
        uint assetId,
        uint224 priceLimit
    ) external validateAssetId(assetId) returns(bool) {
        (IERC20 assetContract, Category category) = _getAssetContract(assetId);
        address seller = _msgSender();
        address storeAddr = address(this);
        uint quantity = IERC20(assetContract).allowance(seller, storeAddr);
        uint storeId = storeFront.length;
        require(quantity > 0, "StoreFront: Quantity too low");
        storeFront.push(
            StoreData(
                address(assetContract),
                seller,
                priceLimit,
                // true,
                AssetMetadata(
                    IERC20Metadata(address(assetContract)).name(),
                    IERC20Metadata(address(assetContract)).symbol(),
                    IERC20Metadata(address(assetContract)).decimals(),
                    category
                ), 
                StoreInfo(quantity, assetId, storeId)
            )
        );

        emit ItemAdded(assetId, assetContract);
        require(
            IERC20(assetContract).transferFrom(seller, storeAddr, quantity),
            "TransferFrom failed"
        );
        return true;
    }

    /**
     * @dev Only store owner function: Change price limit i.e lower price an asset can be sold
     * @param storeId : Required: Store Id. Every Seller maintain a store with a reference Id. Sellers must know where their items are stacked.
     * @param newPriceLimit : Required: Lowest price to activate trade for asset.
     */
    function editPriceLimit(
        uint storeId,
        uint224 newPriceLimit
    ) external validateStoreId(storeId) isStoreOwner(storeId) returns (bool) {
        storeFront[storeId].priceLimit = newPriceLimit;
        return true;
    }

    /**
     * @dev Only owner function: Owner can activate or deactivate asset
     * @param assetId : Asset Id to update.
     * @param value : Value to set for asset. If '0' asset is deactivated otherwise activated.
     */
    function editSupportAsset(
        uint assetId,
        uint8 value
    ) public onlyOwner validateAssetId(assetId) returns (bool) {
        bool prev = supportedAssets[assetId].isVerified;
        bool isVerified = value == 0 ? false : true;
        prev? require(value == 0, "Already activated") : require(value > 0, "Already deactivated"); 
        supportedAssets[assetId].isVerified = isVerified;
        return true;
    }

    /**
     * @dev private function: Executes trade on the instant.
     * Note: Buyers maintain an internal wallet created automatically for them on signUp.
     * Buyer is expected to fund mapped wallet before initiating a trade otherwise execution fails.
     * @param storeId : Store Id.
     * @param amount : Amount of token to order.
     * @param buyer: Buyer address
     * @param offerPrice: Price at which buyer is willing to buy
     * Offerprice should be specified in the same format as limitPrice
     */
    function _makePurchase(
        uint storeId,
        uint224 amount,
        address buyer,
        uint offerPrice
    ) private {
        address xw = xWallets[walletInfo[buyer].id].xWallet;
        require(xw != address(0), "No xWallet detected");
        if (_isStoreIdValid(storeId)) {
            StoreData memory req = storeFront[storeId];
            require(offerPrice >= req.priceLimit, "OfferPrice too low");
            if (req.info.quantity >= amount) {
                uint256 amtToPay;
                uint fee = 1e17 wei;
                unchecked {
                    amtToPay = amount * offerPrice;
                }
                storeFront[storeId].info.quantity = req.info.quantity - amount;
                require(
                    IERC20(cUSD).balanceOf(xw) >= (amtToPay + fee),
                    "Insufficient bal in xw"
                );
                require(
                    IXWallet(xw).transferCUSD(req.seller, amtToPay, fee),
                    "XWallet: Transfer failed"
                );
                if (!IERC20(req.asset).transfer(buyer, amount)) {
                    revert AssetTransferFailed();
                }
            } else {
                revert TokenBalanceInStoreTooLow();
            }
        } else {
            revert InvalidStoreId();
        }
    }

    /**
     * @dev Buyer purchases token
     * @param storeId : Store Id
     * @param amount : Quantity of token/coin to buy
     * @param offerPrice : Price they're willing to offer. Note: Price must be greater than minimum listed price.
     */
    function buy(
        uint storeId,
        uint224 amount,
        uint offerPrice
    ) external validateStoreId(storeId) returns (bool) {
        _makePurchase(storeId, amount, _msgSender(), offerPrice);
        return true;
    }

    /**
     * See _setSupportedAsset
     */
    function setSupportedAsset(IERC20 _asset, uint8 category) public onlyOwner returns (bool) {
        _setSupportedAsset(_asset, category);
        return true;
    }

    /**
     * @dev Unsupport asset
     * @param assetId : Asset Id
     */
    function unSupportAsset(
        uint assetId
    ) public onlyOwner validateAssetId(assetId) returns (bool) {
        supportedAssets[assetId].isVerified = false;
        return true;
    }

    /**
     * @dev Readonly: Return data from storage
     */
    function getData() public view returns(Storage memory stg) {
            stg.stores = storeFront;
            stg.supportedAssets = supportedAssets;
            stg.xWallets = xWallets;
        return stg;
    }
}