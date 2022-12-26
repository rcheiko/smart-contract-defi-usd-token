import { ethers, upgrades } from "hardhat"

// const PROXY = "0x111";

async function main() {
  // const [owner, fundWalletLDG ] = await ethers.getSigners()

  // console.log('------------------------')
  // console.log('Deploying contracts with the account: ' + owner.address)
  // console.log('fundWalletLDG: ' + fundWalletLDG.address)
  // console.log('------------------------')

  const defiToken = await ethers.getContractFactory("LDG01")
  const tokenDeployed = await upgrades.deployProxy(defiToken, {
    initializer: "initialize"
  })

  await tokenDeployed.deployed()
  console.log('\ntokenDeployed: ' + tokenDeployed.address + '\n')

  // const defiSwap = await ethers.getContractFactory("ldgSwap")
  // const swapDeployed = await upgrades.deployProxy(defiSwap, {
  //   initializer: "initialize"
  // })

  // await swapDeployed.deployed()
  // console.log('\nswapDeployed: ' + swapDeployed.address + '\n')

  // const usdToken = await ethers.getContractFactory("usd")
  // const usdDeployed = await usdToken.deploy()

  // await usdDeployed.deployed()
  // console.log('\nusdDeployed: ' + usdDeployed.address + '\n')


  // IF I WANT TO UPGRADE SMART CONTRACT
  // const defiToken2 = await ethers.getContractFactory("ldgDefiUpgradeable2");
  // upgrade Proxy to the new smart contract
  // await upgrades.upgradeProxy(PROXY, defiToken2);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
