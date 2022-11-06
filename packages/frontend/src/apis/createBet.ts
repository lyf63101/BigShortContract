import BigShortAlphaFactoryABI from "@apis/BigShortAlphaFactoryABI.json";
import { ethers, providers, utils } from "ethers";
import { contractAddress } from "@constants/contract";

interface CreateBetPayload {
  counter_party: string;
  predicted_price: number;
  deadline: number;
  higherOrEqual: boolean;
  amount: number;
}

export const createBet = async (signer: providers.JsonRpcSigner, payload: CreateBetPayload) => {
  if (!contractAddress || !utils.isAddress(contractAddress)) {
    throw new Error("invalid contract address");
  }
  const { counter_party, predicted_price, deadline, higherOrEqual, amount } = payload;

  const contract = new ethers.Contract(contractAddress, BigShortAlphaFactoryABI, signer);
  const result = await contract.createNewBetContract(
    counter_party,
    predicted_price,
    deadline,
    higherOrEqual,
    amount
  );
  return result.hash;
};
