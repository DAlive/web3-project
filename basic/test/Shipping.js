const {expect} = require("chai");
const hre = require("hardhat");

describe("Shipping", function() {
    let shippingContract;
    before(async () => {
        shippingContract = await hre.ethers.deployContract("Shipping", []);});
        it("should return the status Pending", async function() {
            expect(await shippingContract.Status()).to.equal("Pending");
        });
        it("should return the status Shipped", async function() {
            await shippingContract.Shipped();
            expect(await shippingContract.Status()).to.equal("Shipped");
        });
        it("should return correct event description", async () => {
            await expect(shippingContract.Delivered())  //验证事件是否被触发
            .to.emit(shippingContract, "LogNewAlert")   //验证事件的参数是否符合预期
            .withArgs("Your package has arrived");

        });
});