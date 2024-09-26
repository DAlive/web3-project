const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
  let MultiSigWallet, wallet;
  let owner1, owner2, owner3, nonOwner;
  const requiredApprovals = 2;

  beforeEach(async function () {
    // 获取合约工厂和签名账户
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");

    // 部署合约，指定拥有者和所需的批准数量
    try {
      wallet = await MultiSigWallet.deploy(
        [owner1.address, owner2.address, owner3.address],
        requiredApprovals
      );
      //await wallet.deployTransaction.wait();
      console.log("wallet addr: ", wallet.target);
      console.log("owner1 addr: ", owner1.address);
      console.log("owner2 addr: ", owner2.address);
      console.log("owner3 addr: ", owner3.address);
      console.log("Required approvals: ", requiredApprovals);
      // await wallet.deployed();
    } catch (error) {
      console.error("Contract deploy failed: ", error);
    }
   

    //预存一些资金到钱包中
    try {
      const tx =  await owner1.sendTransaction({
        to: wallet.target,
        value: ethers.parseEther("10"),
      });
      await tx.wait();
      console.log("Transaction successful");
    } catch (error) {
      console.log("Transaction failed: ", error);
    }

  });

  it("应该正确初始化所有者和所需批准数量", async function () {
    expect(await wallet.owners(0)).to.equal(owner1.address);
    expect(await wallet.owners(1)).to.equal(owner2.address);
    expect(await wallet.owners(2)).to.equal(owner3.address);
    expect(await wallet.required()).to.equal(requiredApprovals);
  });

  it("应该允许拥有者提交交易", async function () {
    const txValue = ethers.parseEther("1.0");

    const txId = await wallet.submit(owner3.address, txValue, "0x");
    const transaction = await wallet.transactions(0);

    expect(transaction.to).to.equal(owner3.address);
    expect(transaction.value).to.equal(txValue);
    expect(transaction.exected).to.equal(false);
  });

  it("应该允许拥有者批准交易", async function () {
    const txValue = ethers.parseEther("1.0");
    await wallet.submit(owner3.address, txValue, "0x");

    // owner1 批准
    await wallet.connect(owner1).approv(0);
    expect(await wallet.approved(0, owner1.address)).to.equal(true);

    // owner2 批准
    await wallet.connect(owner2).approv(0);
    expect(await wallet.approved(0, owner2.address)).to.equal(true);
  });

  it("应该执行在获得足够批准后的交易", async function () {
    const txValue = ethers.parseEther("1.0");

    // 提交交易
    await wallet.submit(owner3.address, txValue, "0x");

    // owner1 和 owner2 批准交易
    await wallet.connect(owner1).approv(0);
    await wallet.connect(owner2).approv(0);

    // 检查 owner3 地址余额增加之前
    const beforeBalance = await ethers.provider.getBalance(owner3.address);

    // 执行交易
    await wallet.connect(owner1).execute(0);

    // 检查交易是否被标记为执行
    const transaction = await wallet.transactions(0);
    expect(transaction.exected).to.equal(true);

    // 检查 owner3 地址余额是否增加
    const afterBalance = await ethers.provider.getBalance(owner3.address);
    const balanceDifference = afterBalance.sub(beforeBalance);

    expect(balanceDifference).to.eq(txValue);
  });

  it("不允许非拥有者提交、批准或执行交易", async function () {
    const txValue = ethers.parseEther("1.0");

    // 尝试由非拥有者提交交易
    await expect(wallet.connect(nonOwner).submit(owner3.address, txValue, "0x")).to.be.revertedWith("not owner");

    // 由拥有者提交交易
    await wallet.connect(owner1).submit(owner3.address, txValue, "0x");

    // 尝试由非拥有者批准交易
    await expect(wallet.connect(nonOwner).approv(0)).to.be.revertedWith("not owner");

    // 尝试由非拥有者执行交易
    await expect(wallet.connect(nonOwner).execute(0)).to.be.revertedWith("not owner");
  });

  it("应该允许拥有者撤销对交易的批准", async function () {
    const txValue = ethers.parseEther("1.0");

    // 提交交易
    await wallet.submit(owner3.address, txValue, "0x");

    // owner1 批准交易
    await wallet.connect(owner1).approv(0);
    expect(await wallet.approved(0, owner1.address)).to.equal(true);

    // owner1 撤销批准
    await wallet.connect(owner1).revoke(0);
    expect(await wallet.approved(0, owner1.address)).to.equal(false);
  });

  it("不允许执行未达到所需批准数的交易", async function () {
    const txValue = ethers.parseEther("1.0");

    // 提交交易
    await wallet.submit(owner3.address, txValue, "0x");

    // 仅有一个批准
    await wallet.connect(owner1).approv(0);

    // 尝试执行交易（需要 2 个批准，但只有 1 个）
    await expect(wallet.connect(owner1).execute(0)).to.be.revertedWith("approvals < required");
  });
});
