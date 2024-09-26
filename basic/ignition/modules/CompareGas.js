const hre = require("hardhat");

async function main() {
    const GasComparison = await hre.ethers.getContractFactory("CompareGas");
    const gasComparison = await GasComparison.deploy();

    // 手动等待部署交易完成
    await gasComparison.deployTransaction.wait();

    console.log("Contract deployed at:", gasComparison.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
