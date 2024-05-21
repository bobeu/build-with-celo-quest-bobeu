// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IXWallet {
    function transferCUSD(address to, uint amount, uint fee) external returns(bool);
}