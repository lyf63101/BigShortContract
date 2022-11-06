// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BigShortAlpha {

    AggregatorV3Interface internal priceFeed;

    address public starter;
    address public counter_party;
    uint public deadline;
    uint public pricePrediction;
    bool public higherOrEqual;
    uint256 public amount;

    uint public bet_start;

    bool public starter_paied = false;
    bool public counter_party_paied = false;

    // IERC20 public USDT = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7); // mainnet

    IERC20 public USDT = IERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F); // testnet USDC

    event Withdrawal(uint amount, uint when);

    /**
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    */
    constructor(address _starter, address _counter_party, uint256 _deadline, uint256 _pricePrediction, bool _higherOrEqual, uint256 _amount) payable {
        require(
            block.timestamp < _deadline,
            "Unlock time should be in the future"
        );
        require(
            _starter != _counter_party,
            "counter_party should not equals to starter"
        ); 
        starter = _starter;
        counter_party = _counter_party;
        deadline = _deadline;
        pricePrediction = _pricePrediction;
        higherOrEqual = _higherOrEqual;
        amount = _amount;

        bet_start = block.timestamp;

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

    function starterPay() external {
        require(msg.sender == starter, "only starter can cancel");
        USDT.transferFrom(msg.sender, address(this), amount);
        starter_paied = true;
    }

    function counterPartyPay() external {
        require(msg.sender == counter_party, "only starter can cancel");
        USDT.transferFrom(msg.sender, address(this), amount);
        counter_party_paied = true;
    }

    function cancel() external {
        require(msg.sender == starter, "only starter can cancel");
        require(starter_paied && (counter_party_paied == false), "could only cancel when counter not paied");
        require(block.timestamp >= bet_start + 7 days, "could only cancel after 3 days");
        USDT.transfer(starter, amount);
    }

    function claimRewards() public {
        // console.log("time is %s, unlockTime is %s", block.timestamp, unlockTime);
        require(msg.sender == starter || msg.sender == counter_party, "You aren't the owner"); 
        require(block.timestamp >= deadline, "You can't claim yet");

        uint priceNow = uint(this.getLatestPrice());

        // console.log("Price is %s, prediction is %s", uint(priceNow), uint(pricePrediction));
        if (higherOrEqual) {
            require(priceNow >= pricePrediction, "price less than prediction");
            USDT.transfer(starter, amount);
            //emit Withdrawal(address(this).balance, block.timestamp);
            return;
        }
        require(priceNow < pricePrediction);
        USDT.transfer(counter_party, amount);
    }
}
