// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >= 0.4.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20MinerReward is ERC20 {
    event LogNewAlert(string description, address indexed _from, uint256 _n);
    constructor() ERC20("MierReward", "MRW") {}
    function _reward() public {
        _mint(block.coinbase, 20);
        emit LogNewAlert("_reward", block.coinbase, block.number);
    }
}