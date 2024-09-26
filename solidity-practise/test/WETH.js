const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WETH Contract", function () {
  let WETH, weth, owner, addr1, addr2;

  beforeEach(async function () {
    // 部署合约
    WETH = await ethers.getContractFactory("WETH");
    [owner, addr1, addr2] = await ethers.getSigners();
    weth = await WETH.deploy();
    //await weth.deploy();

    //获取账户地址
    console.log("owner address:", owner.address);
    console.log("addr1 address:", addr1.address);
    console.log("addr2 address:", addr2.address);
  });

  it("should allow deposit and track balance", async function () {
    // 存款 1 ETH
    await weth.connect(owner).deposit({ value: ethers.parseEther("1.0") });
    
    // 检查余额
    expect(await weth.balanceOf(owner.address)).to.equal(ethers.parseEther("1.0"));
  });

  it("should allow withdrawal", async function () {
    // 存款 1 ETH
    await weth.connect(owner).deposit({ value: ethers.parseEther("1.0") });
    
    // 提取 0.5 ETH
    await weth.connect(owner).withdraw(ethers.parseEther("0.5"));
    
    // 检查余额
    expect(await weth.balanceOf(owner.address)).to.equal(ethers.parseEther("0.5"));
  });

  it("should allow approval and transferFrom", async function () {
    // 存款 1 ETH
    await weth.connect(owner).deposit({ value: ethers.parseEther("1.0") });
    console.log("Owner balance after deposit:", (await weth.balanceOf(owner.address)).toString());
    // 授权 addr1 可以转账 0.5 ETH
    await weth.connect(owner).approve(addr1.address, ethers.parseEther("0.5"));
    
    // addr1 通过 transferFrom 进行转账
    await weth.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("0.5"));
    console.log("Addr1 balance after transfer", (await weth.balanceOf(addr1.address)).toString());
    
    console.log("Addr2 balance after transfer", (await weth.balanceOf(addr2.address)).toString());
    // 检查最终余额
    expect(await weth.balanceOf(addr2.address)).to.equal(ethers.parseEther("0.5"));
  });
});
