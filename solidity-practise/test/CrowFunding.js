// test/CrowFunding.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowFunding Contract", function () {
  let CrowFunding, crowFunding, owner, beneficiary, addr1, addr2;

  beforeEach(async function () {
    CrowFunding = await ethers.getContractFactory("CrowFunding");
    [owner, beneficiary, addr1, addr2] = await ethers.getSigners();
    
    crowFunding = await CrowFunding.deploy(beneficiary.address, ethers.parseEther("10", "ether"));
  });

  it("should deploy with correct beneficiary and funding goal", async function () {
    expect(await crowFunding.benificiary()).to.equal(beneficiary.address);
    expect(await crowFunding.fundingGoal()).to.equal(ethers.parseEther("10", "ether"));
  });

  it("should accept contributions and handle excess funds correctly", async function () {
    const contributeAmount1 = ethers.parseEther("5", "ether");
    const contributeAmount2 = ethers.parseEther("6", "ether");

    await crowFunding.connect(addr1).contribute({ value: contributeAmount1 });
    await crowFunding.connect(addr2).contribute({ value: contributeAmount2 });

    console.log(`Funding Amount: ${ethers.formatUnits(await crowFunding.fundingAmount(), "ether")} ETH`);
    console.log(`Addr1 Contribution: ${ethers.formatUnits(await crowFunding.funders(addr1.address), "ether")} ETH`);
    console.log(`Addr2 Contribution: ${ethers.formatUnits(await crowFunding.funders(addr2.address), "ether")} ETH`);
    
    expect(await crowFunding.fundingAmount()).to.equal(ethers.parseEther("10", "ether"));
    expect(await crowFunding.funders(addr1.address)).to.equal(contributeAmount1);
    expect(await crowFunding.funders(addr2.address)).to.equal(contributeAmount2.sub(ethers.parseEther("1", "ether"))); // 6 ether - 1 ether (excess)
    expect(await crowFunding.fundersLength()).to.equal(2);
  });

  it("should add funders to the list", async function () {
    await crowFunding.connect(addr1).contribute({ value: ethers.parseEther("5", "ether") });
    await crowFunding.connect(addr2).contribute({ value: ethers.parseEther("6", "ether") });

    console.log(`Funder 1: ${await crowFunding.funderKey(0)}`);
    console.log(`Funder 2: ${await crowFunding.funderKey(1)}`);
    
    expect(await crowFunding.funderKey(0)).to.equal(addr1.address);
    expect(await crowFunding.funderKey(1)).to.equal(addr2.address);
  });

  it("should not allow contributions after closing", async function () {
    await crowFunding.connect(addr1).contribute({ value: ethers.parseEther("5", "ether") });
    await crowFunding.connect(addr2).contribute({ value: ethers.parseEther("6", "ether") });
    
    await crowFunding.close();

    await expect(
      crowFunding.connect(addr1).contribute({ value: ethers.parseEther("1", "ether") })
    ).to.be.revertedWith("CrowFunding is closed");
  });

  it("should close the contract and transfer funds to beneficiary", async function () {
    const contributeAmount1 = ethers.parseEther("5", "ether");
    const contributeAmount2 = ethers.parseEther("6", "ether");
    
    await crowFunding.connect(addr1).contribute({ value: contributeAmount1 });
    await crowFunding.connect(addr2).contribute({ value: contributeAmount2 });
    
    const initialBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);

    const tx = await crowFunding.close();
    await tx.wait();

    console.log(`Initial Beneficiary Balance: ${ethers.formatUnits(initialBeneficiaryBalance, "ether")} ETH`);
    const finalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);
    console.log(`Final Beneficiary Balance: ${ethers.formatUnits(finalBeneficiaryBalance, "ether")} ETH`);

    expect(await crowFunding.fundingAmount()).to.equal(0);
    expect(await crowFunding.AVAILABLED()).to.be.false;
    expect(finalBeneficiaryBalance.sub(initialBeneficiaryBalance)).to.equal(ethers.parseEther("10", "ether"));
  });
});
