// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./defi-token-upgradeable.sol";

import "hardhat/console.sol";

contract ldgDefiUpgradeable is Initializable, PausableUpgradeable, OwnableUpgradeable, AccessControlUpgradeable {
        function initialize() external initializer {
        __Ownable_init();
        __Pausable_init();
        __AccessControl_init();
    }
    address tokenAddress = address(0x0); // LDG TOKEN ADDRESS
    address USDAddress = address(0x0); // USD ADDRESS
    address fundWallet = address(0x0); // Fund Wallet

    IERC20Upgradeable token_usd;  // USD TOKEN
    LDG01 token; // LDG TOKEN

    uint256 balance; // USD balance

    // ###### SET FUNCTIONS ######

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
    
    function getAmountUSD(uint256 _amount) public pure returns(uint256) {
        return _amount / (10 ** 12);
    }

    function getAmountLty(uint256 _amount) public pure returns(uint256) {
        return _amount * (10 ** 12);
    }
}