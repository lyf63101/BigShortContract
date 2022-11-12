import { createContext, useContext, FC } from "react";
import { initialCreatePredictionState, useCreatePrediction } from "./useCreatePrediction";

type IContractContext = ReturnType<typeof useCreatePrediction>;
const initialState: IContractContext = {
  createPredictionState: initialCreatePredictionState,
  initCreatePrediction: () => undefined,
  setStep: () => undefined,
  // setBetContract: () => undefined,
  // setIsCounterParty: () => undefined,
  // setLoading: () => undefined,
  // setDeadline: () => undefined,
};

export const ContractContext = createContext(initialState);
export const useContractContext = () => useContext(ContractContext);

export const ContractProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  // const { walletState, validateMetamask, web3, connectMetamask, disconnectMetamask, setIsLogin } =
  //   useWalletReducer();
  const { initCreatePrediction, createPredictionState, setStep } = useCreatePrediction();
  return (
    <ContractContext.Provider
      value={{
        createPredictionState,
        initCreatePrediction,
        setStep,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
