import USDC_ABI from "@apis/USDC_ABI.json";
import { ethers, providers, utils } from "ethers";
import { USDCAddress } from "@constants/contract";

interface ApproveUSDCPayload {
  amount: number;
}

export const approveUSDC = async (signer: providers.JsonRpcSigner, payload: ApproveUSDCPayload) => {
  if (!USDCAddress || !utils.isAddress(USDCAddress)) {
    throw new Error("invalid USDC address");
  }
  const { amount } = payload;

  const contract = new ethers.Contract(USDCAddress, USDC_ABI, signer);
  const signerAddress = await signer.getAddress();
  const balance = await contract.balanceOf(signerAddress);
  console.log("balance:", balance);
  if (balance <= 0) {
    throw new Error(`balance of ${signerAddress} isn't enough`);
  }
  console.log("amount:", amount);
  const result = await contract.approve(signer.getAddress(), amount);
  console.log("approveUSDC result", result);
  // debugger;
  // @ts-ignore
  window.usdc = contract;
  return result;
  // const result = await contract.createNewBetContract(
  //   counter_party,
  //   predicted_price,
  //   deadline,
  //   higherOrEqual,
  //   amount
  // );
  // return result.hash;
};
