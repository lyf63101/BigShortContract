import { netWorkMap } from "@constants/supportedChainIds";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export const useEtherScanUrl = () => {
  const { library } = useWeb3React();

  const etherScanUrl = useMemo(() => {
    const { chainId } = library._network;
    if (!chainId) return;
    const obj = Object.values(netWorkMap).find((val) => val.chainId === chainId);
    if (!obj) return;
    return obj.etherScanUrl;
  }, [library]);

  return etherScanUrl;
};

export default useEtherScanUrl;
