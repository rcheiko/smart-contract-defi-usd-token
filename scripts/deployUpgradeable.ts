const { ethers, upgrades } = require("hardhat");

// const PROXY = "0x111";

async function main() {
  // const [owner, fundWalletCapsa, feeWalletCapsa, fundWalletLDG, feeWalletLDG, feeRoleLDG ] = await ethers.getSigners();

  // console.log('------------------------')
  // console.log('Deploying contracts with the account: ' + owner.address);
  // console.log('fund wallet: ' + fundWalletCapsa.address);
  // console.log('feeWallet: ' + feeWalletCapsa.address);
  // console.log('fundWalletLDG: ' + fundWalletLDG.address);
  // console.log('feeWalletLDG: ' + feeWalletLDG.address);
  // console.log('feeRoleLDG: ' + feeRoleLDG.address);
  // console.log('------------------------');

  const defiToken = await ethers.getContractFactory("LDG01");
  const tokenDeployed = await upgrades.deployProxy(defiToken, {
    initializer: "initialize"
  })

  await tokenDeployed.deployed();
  
  console.log('\ntokenDeployed: ' + tokenDeployed.address + '\n');


  // IF I WANT TO UPGRADE SMART CONTRACT
  // const defiToken2 = await ethers.getContractFactory("ldgDefiUpgradeable2");
  // upgrade Proxy to the new smart contract
  // await upgrades.upgradeProxy(PROXY, defiToken2);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
