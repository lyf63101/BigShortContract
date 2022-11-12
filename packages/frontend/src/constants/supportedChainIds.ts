// export const supportedChainIds = [1, 3, 4, 5, 42, 1337];

export const netWorkMap = {
  goerli: {
    chainId: 5,
    etherScanUrl: "https://goerli.etherscan.io",
  },
  localhost: {
    chainId: 1337,
    etherScanUrl: "",
  },
};

export const supportedChainIds = Object.values(netWorkMap).map((value) => value.chainId);
