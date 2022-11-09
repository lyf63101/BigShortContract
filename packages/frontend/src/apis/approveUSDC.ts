import USDC_ABI from "@apis/USDC_ABI.json";
import { Contract, ethers, providers, utils } from "ethers";
import { USDCAddress } from "@constants/contract";

interface ApproveUSDCPayload {
  amount: number;
}

export const approveUSDC = async (
  signer: providers.JsonRpcSigner,
  betContract: Contract,
  payload: ApproveUSDCPayload
) => {
  if (!USDCAddress || !utils.isAddress(USDCAddress)) {
    throw new Error("invalid USDC address");
  }
  const { amount } = payload;

  const contract = new ethers.Contract(USDCAddress, USDC_ABI, signer);
  const signerAddress = await signer.getAddress();
  const balance = await contract.balanceOf(signerAddress);
  if (balance <= 0) {
    throw new Error(`balance of ${signerAddress} isn't enough`);
  }
  const result = await contract.approve(betContract.address, amount);
  // debugger;
  // @ts-ignore
  window.usdc = contract;
  return result;
};
