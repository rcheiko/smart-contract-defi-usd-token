import { ethers } from "hardhat";

async function main() {
  const usdToken = await ethers.getContractFactory("usd");
  const usdDeployed = await usdToken.deploy();

  await usdDeployed.deployed();
  console.log("\nusdDeployed: " + usdDeployed.address + "\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
