# UNIT TESTING 

TEST THE SMART CONTRACT :
- npx hardhat test

# COMPILE AND DEPLOY/VERIFY THE SMART CONTRACT

COMPILE SMART CONTRACT :
- yarn hardhat compile

DEPLOY THE SMART CONTRACT :
- npx hardhat run scripts/"name of the script".ts --network "name of the network example : goerli"

VERIFY THE SMART CONTRACT :
- npx hardhat verify --network "name of the network example : goerli" "address of the smart contract"

# CONFIGURATION OF ENV

Alchemy API KEY :
- API_KEY=

Etherscan API KEY :
- ETHERSCAN_API_KEY=

Private KEY metamask wallet of owner account :
- OWNER=