import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

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
      polygonMumbai: API_KEY_POLYGON
    },
  },
  
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.API_KEY_ALCHEMY_MUMBAI}`,
      accounts: [`${process.env.OWNER}`],
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.API_KEY_ALCHEMY_POLYGON}`,
      accounts: [`${process.env.OWNER}`], // put the private key of the owner that will deploy the contract
    }
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
