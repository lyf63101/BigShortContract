import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

export const getLibrary = (provider: ExternalProvider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 5000;
  return library;
};
