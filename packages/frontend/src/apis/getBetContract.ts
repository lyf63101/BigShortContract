import BigShortAlphaABI from "@apis/BigShortAlpha.json";
import { ethers, providers, utils } from "ethers";

export const getBetContract = async (signer: providers.JsonRpcSigner, contractAddress?: string) => {
  if (!contractAddress || !utils.isAddress(contractAddress)) {
    throw new Error("invalid contract address");
  }

  const contract = new ethers.Contract(contractAddress, BigShortAlphaABI, signer);
  // @ts-ignore
  window.contract = contract;
  return contract;
};
