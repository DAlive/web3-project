// SPDX-License-Identifier: MIT

pragma solidity >= 0.4.16 < 0.9.0;

//使用汇编之所可以优化并减少gas支出，是因为汇编是直接操作内存的，相比较solidity语法进行遍历减少了边界检查
//以及一些编译器优化
contract CompareGas {
    uint256 public latestSum;
    function sumAsm(uint[] memory data) public returns (uint sum) {
        for (uint i = 0; i < data.length; ++i) {
            assembly {
                //mload: 加载指定内存地址数据到sum
                //add: 类似x86汇编
                //因为solnpx idity中数据是以32字节对齐,且在solidity中数组最开始元素为数组长度
                //所以add(data, 0x20) 是跳过长度元素，开始从真正的第一个元素开始遍历
                //因为每个元素都是占用0x20字节, 所以mul(i, 0x20) 是用来计算元素下标位置
                sum := add(sum, mload(add(add(data, 0x20), mul(i, 0x20))))
            }
        }
        latestSum = sum;
    }

    function sumSolidity(uint[] memory data) public returns (uint sum) {
        for (uint i = 0; i < data.length; ++i) {
            sum += data[i];
        }
        latestSum = sum;
    }
}