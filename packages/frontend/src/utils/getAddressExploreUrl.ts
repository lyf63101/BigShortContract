const ETHER_SCAN_HOST = "https://etherscan.io/";

export const getAddressExploreUrl = (host: string, address: string) => {
  return `${ETHER_SCAN_HOST}/address/${address}`;
};
