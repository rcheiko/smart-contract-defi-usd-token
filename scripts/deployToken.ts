import { ethers, upgrades } from "hardhat";

async function main() {
  // const [owner, fundWalletLUSDC ] = await ethers.getSigners()

  // console.log('------------------------')
  // console.log('Deploying contracts with the account: ' + owner.address)
  // console.log('fundWalletLUSDC: ' + fundWalletLUSDC.address)
  // console.log('------------------------')

  const defiToken = await ethers.getContractFactory("LUSDC");
  const tokenDeployed = await upgrades.deployProxy(defiToken, {
    initializer: "initialize",
  });

  await tokenDeployed.deployed();
  console.log("\ntokenDeployed: " + tokenDeployed.address + "\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
