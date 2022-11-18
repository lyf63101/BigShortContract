# BigShort Protocol

Video

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
<img width="1246" alt="Screen Shot 2022-11-18 at 15 38 11" src="https://user-images.githubusercontent.com/3343486/202647383-144609d4-d312-46b3-915d-29a66b3ad67d.png">
<img width="1206" alt="Screen Shot 2022-11-18 at 15 38 21" src="https://user-images.githubusercontent.com/3343486/202647407-f3cf7a22-fbb3-4ec6-8dc6-1c4382b64fb0.png">
<img width="1203" alt="Screen Shot 2022-11-18 at 15 38 31" src="https://user-images.githubusercontent.com/3343486/202647433-abd69cd6-8341-40c3-ba9a-f4218bab84ed.png">
<img width="1207" alt="Screen Shot 2022-11-18 at 15 38 40" src="https://user-images.githubusercontent.com/3343486/202647470-53a3dc70-7e5c-4d5b-a3eb-60e7ea88eb04.png">
<img width="1233" alt="Screen Shot 2022-11-18 at 15 38 50" src="https://user-images.githubusercontent.com/3343486/202647495-26ef4fd5-046f-4936-a780-a79f310b1798.png">
<img width="1221" alt="Screen Shot 2022-11-18 at 15 38 58" src="https://user-images.githubusercontent.com/3343486/202647513-bee4ed0e-354d-46de-b928-4979df698270.png">
<img width="1244" alt="Screen Shot 2022-11-18 at 15 44 11" src="https://user-images.githubusercontent.com/3343486/202648381-75a36f3a-fbc5-4649-8015-b08aa3a8d285.png">

## Product Screenshot 
<img width="1197" alt="Screen Shot 2022-11-18 at 15 44 50" src="https://user-images.githubusercontent.com/3343486/202648554-a0a1c89b-461d-4091-b9b2-853c04bbc8dc.png">
<img width="1179" alt="Screen Shot 2022-11-18 at 15 44 55" src="https://user-images.githubusercontent.com/3343486/202648564-7a539485-0d8d-4684-9461-c101a8abe665.png">
<img width="1197" alt="Screen Shot 2022-11-18 at 15 45 02" src="https://user-images.githubusercontent.com/3343486/202648574-c3e4d874-6b7b-4ec5-856d-b8784d518775.png">
<img width="998" alt="Screen Shot 2022-11-18 at 15 46 36" src="https://user-images.githubusercontent.com/3343486/202648811-f1ba9cd6-51db-4822-886a-6ee6daba6f85.png">





