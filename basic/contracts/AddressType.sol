// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AddressType {
    address addr = 0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990;
    address payable addr_pay = payable(0x8306300ffd616049FD7e4b0354a64Da835c1A81C);
    function get_balance() public view returns(uint256) {
        return address(this).balance;
    }
    function get_code() public view returns (bytes memory) {
        return address(this).code;
    }
    function get_codehash() public view returns (bytes32) {
        return address(this).codehash;
    }
}