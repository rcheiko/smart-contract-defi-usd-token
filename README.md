# UNIT TESTING 

TEST THE SMART CONTRACT :
- npx hardhat test

# COMPILE AND DEPLOY/VERIFY/TEST(UNIT TESTING) THE SMART CONTRACT

COMPILE SMART CONTRACT :
- yarn hardhat compile

DEPLOY THE SMART CONTRACT :
- npx hardhat run scripts/"name of the script".ts --network "name of the network example : polygon_mumbai"

VERIFY THE SMART CONTRACT :
- npx hardhat verify --network "name of the network example : polygon_mumbai" "address of the smart contract"

TEST THE CONTRACT :
- npx hardhat test

# CONFIGURATION OF ENV

Alchemy API KEY :
- API_KEY=

Etherscan API KEY :
- ETHERSCAN_API_KEY=

Private KEY metamask wallet of owner account :
- OWNER=

# TODO AFTER DEPLOYING THE SMART CONTRACT

1/ MINT_ROLE the swap contract :
- grant_role (mint_role_keccak, contract_swap_address)

2/ Set address on swap contract :
- address of usd / token and fund wallet

3/ For deposit :
- approve the number of token you want to deposit in USD to the swap contract

4/ For withdraw :
- approve number of USD on the fund wallet for the swap contract
- approve number of LUSDC token you want to withdraw to the swap contract