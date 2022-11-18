# BigShort Protocol

这里放一个视频

## Summary 

BigShort protocol is a decentralized over the counter future swap protocol. We use Chainlink network for our price oracle. 
Bigshort provides a fair, safe, efficient and anti-centralized trading tool ensures there is no mediator to damage the content and the asset of the future.

## Demo Page on Testnet

https://big-short.vercel.app/home

## Background 

In 2022 March , before $Luna crash,  Twitter Influencer Algod has tweeted about the design flaw of $Luna and wants to make a bet which basically is a future trading that $luna will be lower price in 1 year from than now. The founder of $Luna Do Kwon accept Algod’s offer. The way they trade is both side send $1M USDT to a third party ( another influencer Cobie). Once their future trade has a result, Cobie will send the money to the winner. This story make our team realize there is no mature protocol onchain to provide user a decentralized point to point future swap protocol.

## Description 

BigShort protocol is implemented in Ethereum network and written in solidity. There are two sides of this protocol: Protocol initiator and protocol receiver. Initiator of the future formulates the contract details: price/ end time / contract size / receiver's wallet address. After initiator creates protocol , he can send the link of receiver. Receiver confirms and verify the contract onchain. Then both side can deposit their asset (their contrat SIZE) 
into the contract address. When the future reaches end time, the contract would use Chainlink's price for oracle price to determine the result of the contract. Later, the asset would automatically sent to either initiator or receiver's address.

This project is the beginning of decentralized point to point future swap. More function would be added into this protocol. Our ultimate goal is to provide more decentralized trading in financial scenarios. 

## Presentation
<img width="1263" alt="Screen Shot 2022-11-18 at 15 36 28" src="https://user-images.githubusercontent.com/3343486/202647306-2e60489a-bffc-4cd4-9e4e-1d519cd7f653.png">




