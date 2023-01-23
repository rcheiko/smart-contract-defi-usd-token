import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Test 2", function () {
  before(async function () {
    [this.owner, this.fundWallet, this.testWallet] = await ethers.getSigners();
    this.decimals_token = 10 ** 18;
    this.decimals_usd = 10 ** 6;
  });

  it("Should deploy the smart contract", async function () {
    this.usdToken = await ethers.getContractFactory("usd");
    this.usdDeployed = await this.usdToken.deploy();

    await this.usdDeployed.deployed();
    console.log("usdDeployed: " + this.usdDeployed.address + "\n");

    this.defiToken = await ethers.getContractFactory("LUSDC");
    this.tokenDeployed = await upgrades.deployProxy(this.defiToken, {
      initializer: "initialize",
    });

    await this.tokenDeployed.deployed();
    console.log("tokenDeployed: " + this.tokenDeployed.address + "\n");

    this.defiSwap = await ethers.getContractFactory("LUSDCSwap");
    this.swapDeployed = await upgrades.deployProxy(this.defiSwap, {
      initializer: "initialize",
    });

    await this.swapDeployed.deployed();
    console.log("swapDeployed: " + this.swapDeployed.address + "\n");

    this.MINT_ROLE = await this.tokenDeployed.MINT_ROLE();

    await this.tokenDeployed.grantRole(
      this.MINT_ROLE,
      this.swapDeployed.address
    );
    await this.swapDeployed.setToken(this.tokenDeployed.address);
    await this.swapDeployed.setTokenUSD(this.usdDeployed.address);
    await this.swapDeployed.setFundWallet(this.fundWallet.address);
  });

  it("Should mint usd for Test Wallet and approve in swap SM and should approve 1 usd to swap SM with fund wallet", async function () {
    await this.usdDeployed.mint(this.testWallet.address, 11);
    await this.usdDeployed
      .connect(this.testWallet)
      .approve(this.swapDeployed.address, 11 * this.decimals_usd);
    await this.usdDeployed
      .connect(this.fundWallet)
      .approve(this.swapDeployed.address, 1 * this.decimals_usd);

    const balanceUSDTestWallet = await this.usdDeployed.balanceOf(
      this.testWallet.address
    );
    expect(JSON.parse(balanceUSDTestWallet)).to.equal(11 * this.decimals_usd);
    const allowanceUSDTestWallet = await this.usdDeployed.allowance(
      this.testWallet.address,
      this.swapDeployed.address
    );
    expect(JSON.parse(allowanceUSDTestWallet)).to.equal(11 * this.decimals_usd);
    const allowanceUSDFundWallet = await this.usdDeployed.allowance(
      this.fundWallet.address,
      this.swapDeployed.address
    );
    expect(JSON.parse(allowanceUSDFundWallet)).to.equal(1 * this.decimals_usd);
  });

  it("Should try to deposit and withdraw more than he have", async function () {
    await this.swapDeployed
      .connect(this.testWallet)
      .deposit(1 * this.decimals_usd);

    await this.tokenDeployed
      .connect(this.testWallet)
      .approve(this.swapDeployed.address, BigInt(2 * this.decimals_token));

    await expect(
      this.swapDeployed
        .connect(this.testWallet)
        .withdraw(BigInt(2 * this.decimals_token))
    ).to.be.revertedWith("You don't have enough money to withdraw.");
  });

  it("Should wait 1 year and try to transfer the balanceOf", async function () {
    await time.increase(60 * 60 * 24 * 365); // 1 year

    let balanceLUSDCTestWallet = await this.tokenDeployed.balanceOf(
      this.testWallet.address
    );

    await this.tokenDeployed
      .connect(this.testWallet)
      .transfer(this.owner.address, BigInt(1.05 * this.decimals_token));

    balanceLUSDCTestWallet = await this.tokenDeployed.balanceOf(
      this.testWallet.address
    );
    expect(JSON.parse(balanceLUSDCTestWallet)).to.below(
      0.01 * this.decimals_token
    );

    const balanceLUSDCOwnerWallet = await this.tokenDeployed.balanceOf(
      this.owner.address
    );
    expect(JSON.parse(balanceLUSDCOwnerWallet)).to.equal(
      1.05 * this.decimals_token
    );
  });

  it("Should try to mint LUSDC Token directly and get reverted", async function () {
    await expect(
      this.tokenDeployed
        .connect(this.testWallet)
        .mint(this.testWallet.address, BigInt(100 * this.decimals_token))
    ).to.be.reverted;
  });

  it("Should wait 1 year, try to setAPY and check if balance has been updated", async function () {
    await time.increase(60 * 60 * 24 * 365); // 1 year

    await this.tokenDeployed.connect(this.owner).setAPY(45);

    const balanceLUSDCOwnerWallet = await this.tokenDeployed.principalBalanceOf(
      this.owner.address
    );
    expect(JSON.parse(balanceLUSDCOwnerWallet))
      .to.above(1.1 * this.decimals_token)
      .to.below(1.103 * this.decimals_token);
  });
});
