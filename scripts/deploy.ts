import { ethers } from "hardhat";

async function main() {
  const [owner, fundWalletCapsa, feeWalletCapsa, fundWalletLDG, feeWalletLDG, feeRoleLDG ] = await ethers.getSigners();

  console.log('------------------------')
  console.log('Deploying contracts with the account: ' + owner.address);
  console.log('fund wallet: ' + fundWalletCapsa.address);
  console.log('feeWallet: ' + feeWalletCapsa.address);
  console.log('fundWalletLDG: ' + fundWalletLDG.address);
  console.log('feeWalletLDG: ' + feeWalletLDG.address);
  console.log('feeRoleLDG: ' + feeRoleLDG.address);
  console.log('------------------------');

  const defiToken = await ethers.getContractFactory("ldgDefi");
  const tokenDeployed = await defiToken.deploy();

  await tokenDeployed.deployed();
  
  console.log('\ntokenDeployed: ' + tokenDeployed.address + '\n');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
