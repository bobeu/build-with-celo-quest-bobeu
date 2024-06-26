// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IRegistry } from "../interfaces/IRegistry.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20 {
    uint mintable;
    address public admin;
    constructor(string memory tokenName, string memory tokenSymbol, address other) ERC20(tokenName, tokenSymbol) {
        admin = msg.sender;
        mintable = 200000 * (10**18);
        _mint(admin, mintable);
        _mint(other, mintable);
    } 

    function mint(address to) public returns(bool) {
        require(msg.sender == admin, "Not permitted");
        _mint(to, mintable);
        return true;
    }
}