import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

const ETHERSCAN_API_KEY:any = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  //  networks: {
  //     hardhat: {
  //        chainId: 1337
  //     }
  //  }
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [`${process.env.OWNER}`],
    },
  },
  gasReporter: {
    enabled: true,
  }
};

export default config;
