import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  //   settings: {
  //     optimizer: {
  //        enable:true,
  //        runs:200
  //     }
  //  },
  //  networks: {
  //     hardhat: {
  //        chainId: 1337
  //     }
  //  }
  etherscan: {
    apiKey: {
      goerli: "5E26R6QIAKT14HB3Z7QJYII6338G38GCPX",
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
