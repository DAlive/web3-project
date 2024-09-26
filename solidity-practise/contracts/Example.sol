// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract Example {
    uint256 public value;

    function setValue(uint256 newValue) external {
        value = newValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}