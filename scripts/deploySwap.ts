import { ethers, upgrades } from "hardhat"

// const PROXY = "0x111";

async function main() {
  const defiSwap = await ethers.getContractFactory("ldgSwap")
  const swapDeployed = await upgrades.deployProxy(defiSwap, {
    initializer: "initialize"
  })

  await swapDeployed.deployed()
  console.log('\nswapDeployed: ' + swapDeployed.address + '\n')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
