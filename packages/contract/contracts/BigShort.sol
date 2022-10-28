// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BigShortAlpha {

    AggregatorV3Interface internal priceFeed;

    uint public unlockTime;
    address payable public owner;

    int public pricePrediction;

    event Withdrawal(uint amount, uint when);

    /**
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    */
    constructor(uint _unlockTime, int _pricePrediction) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        pricePrediction = _pricePrediction;
        owner = payable(msg.sender);
        //priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419); // mainnet
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function withdraw() public {
        console.log("time is %s, unlockTime is %s", block.timestamp, unlockTime);
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        int priceNow = this.getLatestPrice();

        console.log("Price is %s, prediction is %s", uint(priceNow), uint(pricePrediction));

        require(priceNow > pricePrediction, "price less than prediction");

        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }
}
