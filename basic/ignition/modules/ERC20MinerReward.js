const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("erc", (m) => {
    const erc20 = m.contract("ERC20MinerReward", []);
    m.call(erc20, "_reward", []);
    return {erc20};
})