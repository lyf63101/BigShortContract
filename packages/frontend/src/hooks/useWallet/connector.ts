import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedChainIds } from "@constants/supportedChainIds";

export const injectedConnector = new InjectedConnector({ supportedChainIds });
