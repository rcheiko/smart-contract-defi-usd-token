// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./defi-token-upgradeable.sol";

contract ldgSwap is Initializable, PausableUpgradeable, OwnableUpgradeable {

    function initialize() external initializer {
        __Ownable_init();
        __Pausable_init();
        usd_decimal = 6;
    }

    address tokenAddress; // LDG TOKEN ADDRESS
    address USDAddress; // USD ADDRESS
    address fundWallet; // Fund Wallet

    IERC20Upgradeable token_usd;  // USD TOKEN
    LDG01 token; // LDG TOKEN

    uint256 balance; // USD balance
    uint8 public usd_decimal; // Decimal of USD Token

    modifier isTokenSet() { // Check is all the address has been correctly set
        require(USDAddress != address(0x0), "USD Token address cannot be 0x0.");
        require(tokenAddress != address(0x0), "Token LDG address cannot be 0x0.");
        require(fundWallet != address(0x0), "Fund Wallet address cannot be 0x0.");
        _;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     *  SET FUNCTIONS
     **/

    function setToken(address _token) external onlyOwner { // SET LDG TOKEN
        token = LDG01(_token);
        tokenAddress = address(_token);
    }

    function setTokenUSD(address _token) external onlyOwner { // SET USD TOKEN
        token_usd = IERC20Upgradeable(_token);
        USDAddress = address(_token);
    }

    function setFundWallet(address _wallet) external onlyOwner { // SET FUND WALLET
        fundWallet = address(_wallet);
    }

        function setUsdDecimal(uint8 decimal) external onlyOwner { // SET USD DECIMAL
        usd_decimal = decimal;
    }

    function getAmountUSD(uint256 amount) public view returns(uint256) {
        return amount / (10 ** (18 - usd_decimal));
    }

    function getAmountLTY(uint256 amount) public view returns(uint256) {
        return amount * (10 ** (18 - usd_decimal));
    }

    /**
     *  SWAP FUNCTIONS
     **/

    /**
     * @dev It will give you equivalent amount of LTY Token for 1 USD / 1 LTY01
     * @param amount total usd you want to deposit
     **/
    function deposit(uint256 amount) external isTokenSet whenNotPaused {
        require(token_usd.balanceOf(msg.sender) >= amount, "You need to have enough USD in your balance");
        require(token_usd.allowance(msg.sender, address(this)) >= amount, "The contract has not allowed enough USD Token on the contract to spend it");


        uint256 amountLTY = getAmountLTY(amount); // Amout LTY bought with the USD of the user
        bool res = token_usd.transferFrom(msg.sender, fundWallet, amount); // transfer all the USD in the fund Wallet
        require(res, "The Transfer has been failed, please try again.");

        token.mint(msg.sender, amountLTY);   // Token LDG minted and gived to the users
    }

    /**
     * @dev It will give you equivalent amount of USDC for 1 LTY01 / 1 USD
     * @param amount total lty token you want to withdraw
     **/
    function withdraw(uint256 amount) external isTokenSet whenNotPaused {
        require(token.balanceOf(msg.sender) >= amount, "You don't have enough money to withdraw.");
        require(token.allowance(msg.sender, address(this)) >= amount, "You haven't allowed enough token to withdraw.");

        uint256 amountUSD = getAmountUSD(amount); // Amout LTY bought with the USD of the user
        require(token_usd.allowance(fundWallet, address(this)) >= amountUSD, "The fund wallet hasn't allowed enough token to withdraw.");

        token.burnFrom(msg.sender, amount);
        token_usd.transferFrom(fundWallet, msg.sender, amountUSD);
    }
}