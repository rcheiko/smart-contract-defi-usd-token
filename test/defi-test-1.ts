import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Defi - token/swap Smart Contract", function () {
  before(async function () {
    [this.owner, this.fundWallet, this.testWallet] = await ethers.getSigners();
    this.decimals_token = 10 ** 18;
    this.decimals_usd = 10 ** 6;
  });

  it("Should deploy the smart contract", async function () {
    console.log("###################");
    console.log("owner wallet :", this.owner.address);
    console.log("fund wallet :", this.fundWallet.address);
    console.log("test wallet :", this.testWallet.address);
    console.log("###################\n");

    this.usdToken = await ethers.getContractFactory("usd");
    this.usdDeployed = await this.usdToken.deploy();

    await this.usdDeployed.deployed();
    console.log("usdDeployed: " + this.usdDeployed.address + "\n");

    this.defiToken = await ethers.getContractFactory("LDG01");
    this.tokenDeployed = await upgrades.deployProxy(this.defiToken, {
      initializer: "initialize",
    });

    await this.tokenDeployed.deployed();
    console.log("tokenDeployed: " + this.tokenDeployed.address + "\n");

    this.defiSwap = await ethers.getContractFactory("ldgSwap");
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

  it("Should mint/approve usd for Test Wallet in swap SM and should approve 1 usd to swap SM with fund wallet", async function () {
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

  it("Should deposit 1 usd for 1 lty with test Wallet", async function () {
    await this.swapDeployed
      .connect(this.testWallet)
      .deposit(1 * this.decimals_usd);

    // check if the test wallet received the lty
    const balanceLTYTestWallet = await this.tokenDeployed.balanceOf(
      this.testWallet.address
    );
    expect(JSON.parse(balanceLTYTestWallet)).to.equal(1 * this.decimals_token);

    // check if the fund wallet received the usd
    const balanceUSDFundWallet = await this.usdDeployed.balanceOf(
      this.fundWallet.address
    );
    expect(JSON.parse(balanceUSDFundWallet)).to.equal(1 * this.decimals_usd);
    
    await time.increase(60 * 60 * 24 * 365); // 1 year

    const balanceLTY = await this.tokenDeployed.balanceOf(this.testWallet.address)
    expect(JSON.parse(balanceLTY)).to.equal(1.05 * this.decimals_token) // 5 % more for 1 year of staking
  });

  it("Should approve/withdraw 1 lty for 1 usd with test Wallet", async function () {
    await this.tokenDeployed.connect(this.testWallet).approve(this.swapDeployed.address, BigInt(1 * this.decimals_token))

    const allowanceTestWallet = await this.tokenDeployed.allowance(this.testWallet.address, this.swapDeployed.address)
    expect(JSON.parse(allowanceTestWallet)).to.equal(1 * this.decimals_token)

    await this.swapDeployed.connect(this.testWallet).withdraw(BigInt(1 * this.decimals_token))

    const balanceUSDFundWallet = await this.usdDeployed.balanceOf(this.fundWallet.address)
    expect(JSON.parse(balanceUSDFundWallet)).to.equal(0)

    const balanceLTYTestWallet = await this.tokenDeployed.balanceOf(this.testWallet.address)
    console.log(JSON.parse(balanceLTYTestWallet))
    expect(JSON.parse(balanceLTYTestWallet)).to.below(1 * this.decimals_token)

    const balanceUSDTestWallet = await this.usdDeployed.balanceOf(this.testWallet.address)
    expect(JSON.parse(balanceUSDTestWallet)).to.equal(11 * this.decimals_usd)

    
  })
});
