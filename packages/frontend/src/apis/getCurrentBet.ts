import BigShortAlphaFactoryABI from "@apis/BigShortAlphaFactoryABI.json";
import { ethers, providers, utils } from "ethers";
import { contractAddress } from "@constants/contract";
import { isEmptyAddress } from "@utils/isEmptyAddress";

export const getCurrentBet = async (signer: providers.JsonRpcSigner) => {
  if (!contractAddress || !utils.isAddress(contractAddress)) {
    throw new Error("invalid contract address");
  }

  const contract = new ethers.Contract(contractAddress, BigShortAlphaFactoryABI, signer);
  const address = await signer.getAddress();
  const result = await contract.resolveBetContractByOwnner(address);
  if (isEmptyAddress(result)) return null;
  return result;
};
