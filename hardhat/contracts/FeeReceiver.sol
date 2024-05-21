// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FeeReceiver is Ownable {
    constructor () Ownable(_msgSender()) {}

    function withdraw(uint amount, address to, address asset) public onlyOwner returns(bool) {
        return IERC20(asset).transfer(to, amount);
    }
}