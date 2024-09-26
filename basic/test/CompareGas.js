const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CompareGas", function() {
    let GasComparison;
    let gasComparison;

    this.beforeEach(async function() {
        try{
        //获取合约工厂
        GasComparison = await ethers.getContractFactory("CompareGas");
        //console.log("Contract factory created:", GasComparison);
        
        //部署合约实例
        //gasComparison = await GasComparison.deploy();
        gasComparison = await GasComparison.deploy();
        await gasComparison.deployTransaction.wait();
        //console.log("Contract deployed:", gasComparison);

        //确保合于已完成部署
        //await gasComparison.deployed();
        //console.log("Contract deployed adn ready to use");
    } catch (error) {
        console.error("Error deploying contract:", error);
    }
    });

    it("should compare gas usage between sumAsm and sum Solidity", async function() {
        //生成一个1到100的数组
        const data = Array.from({length: 100}, (_, i) => i + 1);

        //调用sumAsm函数并获取gas消耗
        const txAsm = await gasComparison.sumAsm(data);
        console.log("Transaction object for sumAsm", txAsm);

        const txSol = await gasComparison.sumSolidity(data);
        console.log("Transaction object for sumSol", txSol);

        // if(txAsm.wait) {
        //     const receiptAsm = await txAsm.wait();
        //     const gasUseAsm = receiptAsm.gasUsed;
        //     console.log("Gas used by sumAsm:", gasUseAsm.toString());
        // }else{
        //     console.error("txAsm does not have a wait method. Transaction object:", txAsm);
        // }

        // //调用sumSolidity 函数并获取gas消耗
        // const txSol = await gasComparison.sumSolidity(data);
        // console.log("Transaction object for sumSol", txSol);

        // if (txSol.wait) {
        //     const receiptSol = await txSol.wait();
        //     const gasUseSol = receiptSol.gasUsed;
        //     console.log("Gas used by sumSolidity:", gasUseSol.toString());
        // }else {
        //     console.error("txSol does not have a wait method. Transaction object:", txSol);
        // }

        const receiptAsm = await txAsm.wait();
        const gasUseAsm = receiptAsm.gasUsed;
        console.log("Gas used by sumAsm:", gasUseAsm.toString());

        const receiptSol = await txSol.wait();
        const gasUseSol = receiptSol.gasUsed;
        console.log("Gas used by sumSolidity:", gasUseSol.toString());
    
        //比较两者的gas消耗
        expect(gasUseAsm).to.be.lessThanOrEqual(gasUseSol);

    });

});