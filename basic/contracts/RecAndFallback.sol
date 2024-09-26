// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Callee {
    event FunctionCalled(string);

    function foo() external payable {
        emit FunctionCalled("This is foo");
    }

    receive() external payable {
        emit FunctionCalled("This is Receive");
    }

    fallback() external payable {
        emit FunctionCalled("This is fallback");
    }
}

contract RecAndFallback {
    address payable callee;

    constructor() payable {
        callee = payable(address(new Callee()));
    }

    function transferReceive() external {
        callee.transfer(1);
    }

    function sendReceive() external {
        (bool success, bytes memory data) = callee.call{value: 1}("");
        require(success, "Failed to send Ether");
    }

    function callFoo() external {
        (bool success, bytes memory data) = callee.call{value: 1} (
            abi.encodeWithSignature("foo()")
            );
        require(success, "Failed to send Ether");
    }

    function callFallBack() external {
        (bool success, bytes memory data) = callee.call{value: 1} (
            abi.encodeWithSignature("funcNotExist()")
        );
        require(success, "Failed to send Ether");
    }
}