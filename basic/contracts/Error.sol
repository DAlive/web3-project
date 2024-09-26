// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Error {
    function testRequire(address payable addr1, address payable addr2) public payable {
        require(msg.value % 2 == 0, "Even value required.");
        addr1.transfer(msg.value / 2);
        addr2.transfer(msg.value / 2);
    }

    function testAssert(address payable addr1, address payable addr2) public payable {
        require(msg.value % 2 == 0, "Even value required.");
        uint balanceBeforeTransfer = address(this).balance;
        addr1.transfer(msg.value / 2);
        addr2.transfer(msg.value / 2);
        assert(address(this).balance == balanceBeforeTransfer);
    }

    function testRevert(address payable addr1, address payable addr2) public payable {
        if (msg.value % 2 == 0) {
            revert("Even value revertd.");
        }

        addr1.transfer(msg.value / 2);
        addr2.transfer(msg.value / 2);
    }
}