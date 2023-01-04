import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY_ETHERSCAN: any = process.env.API_KEY_ETHERSCAN;
const API_KEY_POLYGON: any = process.env.API_KEY_POLYGON;

const config: HardhatUserConfig = {
  solidity: "0.8.7",

  //  networks: {
  //     hardhat: {
  //        chainId: 1337
  //     }
  //  },

  etherscan: {
    apiKey: {
      goerli: API_KEY_ETHERSCAN,
      polygonMumbai: API_KEY_POLYGON
    },
  },

  // networks: {
  //   hardhat: {},
  //   goerli: {
  //     url: `https://eth-goerli.g.alchemy.com/v2/${process.env.API_KEY_GOERLI}`,
  //     accounts: [`${process.env.OWNER}`],
  //   },
  // },

  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.API_KEY_MUMBAI}`,
      accounts: [`${process.env.OWNER}`],
    },
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
