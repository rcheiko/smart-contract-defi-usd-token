// import { ethers, upgrades } from "hardhat";

// const address = "0xF28b65731366c71BcF4112f3a9B8c456Cfc1aD07"; // LUSDC Transparent Upgradeable Proxy address

// async function main() {
//   const upgradeDefiToken = await ethers.getContractFactory("LUSDCUpgradeable"); // LUSDCUpgradeable is the name of the contract
//   const tokenDeployed = await upgrades.upgradeProxy(address, upgradeDefiToken);

//   await tokenDeployed.deployed();
//   console.log("\nUpgrade Token Deployed: " + tokenDeployed.address + "\n");
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
