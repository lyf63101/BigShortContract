import { Web3ReactProvider } from "@web3-react/core";
import { FC, ReactNode } from "react";
import { getLibrary } from "./getLibrary";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
};
