// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IRegistry } from "./interfaces/IRegistry.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

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