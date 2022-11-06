import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { injectedConnector } from "./connector";

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;
    if (!active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injectedConnector);
      };
      const handleChainChanged = (chainId: number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injectedConnector);
        }
      };
      const handleNetworkChanged = (networkId: number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injectedConnector);
      };

      ethereum.on("connect", handleConnect);
      // @ts-ignore
      ethereum.on("chainChanged", handleChainChanged);
      // @ts-ignore
      ethereum.on("accountsChanged", handleAccountsChanged);
      // @ts-ignore
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        ethereum.removeListener("connect", handleConnect);
        ethereum.removeListener("chainChanged", handleChainChanged);
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("networkChanged", handleNetworkChanged);
      };
    }
  }, [active, error, suppress, activate]);
}
