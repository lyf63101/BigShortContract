// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./BigShort.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BigShortAlphaFactory is Ownable {

    mapping(address => address) private betOwnners;

    /**
     * @dev Emitted on createNewBetContract()
     * @param starter The address of bet starter
     * @param counter_party The address of counter party 
     * @param predicted_price The predicted token price
     * @param deadline The predicted deadline
     * @param higherOrEqual higherOrEqual , if set to false, predict token price will lower than predicted price
     * @param amount The amount of token to bet
     **/
    event NewBetContractCreated (
        address indexed starter,
        address indexed counter_party,
        uint256 deadline,
        uint256 predicted_price,
        bool higherOrEqual,
        uint256 amount
    );

    constructor() payable {
    }

    function resolveBetContractByOwnner(address owner) external view returns(address) {
        return betOwnners[owner];
    }

    function createNewBetContract(
        address  counter_party,
        uint256 predicted_price,
        uint256 deadline,
        bool higherOrEqual,
        uint256 amount
        // address tokenAddress // only USDT now
        ) external payable returns(address) {
            require(msg.sender == tx.origin, "contract call is not allowed");
            BigShortAlpha betContract = new BigShortAlpha(msg.sender, counter_party, deadline, predicted_price, higherOrEqual, amount);
            require(msg.sender != counter_party, "can't play with yourself");
            betOwnners[msg.sender] = address(betContract);
            betOwnners[counter_party] = address(betContract);
            emit NewBetContractCreated(msg.sender, counter_party, deadline, predicted_price, higherOrEqual, amount);
            return address(betContract);
    }

}