// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


interface IXWallet {
    function transferCUSD(address to, uint amount, uint fee) external returns(bool);
}

interface IRegistry {
    enum Category { MEME, NFT, DEFI, GOVERNANCE, RWA, GAMING, YIELDOPTIMIZER, SPORT, PRIVACY, METAVERSE }
    error InvalidAssetId(uint assetId);
    error TokenBalanceInStoreTooLow();
    error NotPermitted();
    error InvalidStoreId();
    error AssetTransferFailed();

    struct StoreData {
        address asset;
        address seller;
        uint priceLimit;
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
        Category category;
    }

    struct SupportedAsset {
        uint assetId;
        IERC20 asset;
        bool isVerified;
        Category category;
        string name;
        string symbol;
    }

    struct Wallet {
        address owner;
        address xWallet;
    }

    struct WalletInfo {
        uint id;
        bool hasWallet;
    }

    struct Storage {
        StoreData[] stores;
        SupportedAsset[] supportedAssets;
        Wallet[] xWallets;
    }

    function addItemToStoreFront(uint assetId, uint priceLimit) external returns(bool);
    function createXWallet() external returns(bool);
    function buy(uint storeId, uint amount, uint offerPrice) external returns(bool);
  
    event ItemAdded(uint itemId, IERC20 asset);
    event ItemRemoved(uint itemId, IERC20 asset);
}

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


contract XWallet is Ownable {
    address public cUSD;
    address public feeTo;

    constructor (address _cUSD, address _feeTo) Ownable(_msgSender()) {
        require(_cUSD != address(0) && _feeTo != address(0), "Initial Addresses are empty");
        cUSD = _cUSD;
        feeTo = _feeTo;
    }

    function _sendCUSD(address to, uint amount) private {
        if(IERC20(cUSD).balanceOf(address(this)) < amount) {
            revert InsufficientBalance();
        }
        require(IERC20(cUSD).transfer(to, amount), "XWallet: Transfer failed");
    }

    function transferCUSD(address to, uint amount, uint fee) external onlyOwner returns(bool) {
        if(fee > 0) {
            _sendCUSD(feeTo, fee);
        }
        _sendCUSD(to, amount);
        return true;
    }

    error InsufficientBalance();
}

contract RegistryMain is IRegistry, Ownable {
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
                category: Category(categoryId),
                name: IERC20Metadata(address(_supportedAssets)).name(),
                symbol: IERC20Metadata(address(_supportedAssets)).symbol()
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
        uint priceLimit 
    ) external validateAssetId(assetId) returns(bool) {
        (IERC20 assetContract, Category category) = _getAssetContract(assetId);
        address seller = _msgSender();
        address registry = address(this);
        uint quantity = IERC20(assetContract).allowance(seller, registry);
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
            IERC20(assetContract).transferFrom(seller, registry, quantity),
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
        uint amount,
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
                    amtToPay = (amount * offerPrice) / 1 ether;
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
        uint amount,
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