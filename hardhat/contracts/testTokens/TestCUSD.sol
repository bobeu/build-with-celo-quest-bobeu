// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IRegistry } from "../interfaces/IRegistry.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract TestCUSD is ERC20 {
    uint mintable;
    address public admin;
    constructor() ERC20("TestCUSD", "TCUSD") {
        admin = msg.sender;
        mintable = 200000 * (10**18);
        _mint(admin, mintable);
    } 

    function mint(address to) public returns(bool) {
        require(msg.sender == admin, "Not permitted");
        _mint(to, mintable);
        return true;
    }
}