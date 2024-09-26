const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("UseAsm", function () {
    it("should deploy a simple contract", async function () {
        const SimpleContract = await ethers.getContractFactory("UseAsm");
        const simpleInstance = await SimpleContract.deploy();

        console.log("Simple contract deployed at:", simpleInstance.address);

        // 检查部署对象
        console.log("Deploy transaction:", simpleInstance.deployTransaction);

        await simpleInstance.deployTransaction.wait();
    });
});
