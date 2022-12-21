// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

contract ldgDefi is ERC20, ERC20Burnable, Pausable, Ownable, AccessControl {
    constructor() ERC20("ldgDefi", "LDG01") {
        updateBalance(msg.sender);
        _mint(msg.sender, 100 * 10 ** 18);
    }
    
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE"); // MINT ROLE TO CALL mint in different smart contract
    uint32 public APY = 50; // revenue in % per year that would be generated in token ( 3 decimals ) example : 50 = 0.05 = 5%
    mapping (address => uint256) private lastUpdateInterest; // When is the last time was updated the timestamp of his token
    address[] internal userAddr; // We will store all address to update the mapping of lastUpdateInterest

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINT_ROLE) {
        require(hasRole(MINT_ROLE, msg.sender));
        updateBalance(to);
        _mint(to, amount);
    }

    /**
     * @dev This function that would generated APY with 3 decimals ( example : 100 = 0.1 = 10% )
     * @param _apy the APY with 3 decimals
     **/
    function setAPY(uint16 _apy) external onlyOwner {
        // need to updateBalance of all user
        for (uint256 i = 0; i < userAddr.length; i++) {
            updateBalance(userAddr[i]);
        }
        APY = _apy;
    }

    /**
     * @dev The contract will calculate your benefit and mint for you the benefit in your account
     * @param _user the address from wich you want to update the balance
     **/
    function updateBalance(address _user) public {
        uint256 previousPrincipalBalance = super.balanceOf(_user);
        uint256 balanceIncrease = balanceOf(_user) - previousPrincipalBalance;
        if (lastUpdateInterest[_user] == 0) {
            userAddr.push(_user);
        }
        lastUpdateInterest[_user] = block.timestamp;
        if (previousPrincipalBalance == 0) {
            return ;
        }
        _mint(_user, balanceIncrease);
    }

    /**
     * @dev Percentage of time staking for 365 days before the last update ( example : 36,5 days is 10% )
     * @param _user the address from wich you want to see the balance
     **/
    function PercentageTimeStakingBeforeLastUpdate(address _user) internal view returns(uint256) {
        uint256 diffResult = (block.timestamp - lastUpdateInterest[_user]); // Difference between date.now() - lastUpdate of the user
        return ((diffResult * 10 ** 18) / 365 days); // The percentage of the time staking in 1 year, example : if is stacked 1 year exactly he will have 1 ( 100 % )
    }

    /**
     * @dev balance of the tokens + interest accumulate with your principal balance
     * @param _user the address from wich you want to see the balance
     **/
    function balanceOf(address _user) public view override returns(uint256) {
        uint256 currentPrincipalBalance = super.balanceOf(_user);

        if (currentPrincipalBalance == 0) {
            return 0;
        }

        uint PercentageTimeStaking = PercentageTimeStakingBeforeLastUpdate(_user);
        return (((currentPrincipalBalance * PercentageTimeStaking) * APY / 10 ** 21) + currentPrincipalBalance); // interest accumulate + currentBalance ( 21 = 18 decimals + 3 APY decimals )
    }

    function principalBalanceOf(address _user) external view returns(uint256) {
        return super.balanceOf(_user);
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer} with update balance of each user
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal virtual override {
        updateBalance(_from);
        updateBalance(_to);
        super._transfer(_from, _to, _amount); //performs the transfer
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused // check if the contract is paused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
