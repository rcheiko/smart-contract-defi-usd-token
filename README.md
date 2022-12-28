# UNIT TESTING 

TEST THE CONTRACT :
- npx hardhat test

# COMPILE AND DEPLOY/VERIFY THE SMART CONTRACT

COMPILE SMART CONTRACT :
- yarn hardhat compile

DEPLOY THE CONTRACT :
- npx hardhat run scripts/'name of the script'.ts --network 'name of the network example : goerli'

VERIFY THE CONTRACT :
- npx hardhat verify --network 'name of the network example : goerli' 'address of the smart contract'