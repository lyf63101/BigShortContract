import { utils } from "ethers";

export const briefAddress = (address?: string | null): string => {
  if (!address) return "--";
  if (!utils.isAddress(address)) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
