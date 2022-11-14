import { getBetContract } from "@apis/getBetContract";
import { getCurrentBet } from "@apis/getCurrentBet";
import { ROUTERS } from "@constants/router";
import { handleError } from "@utils/handleError";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

enum CreatePredictionStep {
  PredictionSetup = 0,
  SharePrediction = 1,
  StartPrediction = 2,
  PredictionResult = 3,
}

export interface ICreatePrediction {
  step: CreatePredictionStep;
  betContract?: Contract;
  isCounterParty: boolean;
  loading?: boolean;
  deadline: number;
}

export const initialCreatePredictionState: ICreatePrediction = {
  step: CreatePredictionStep.PredictionSetup,
  isCounterParty: false,
  deadline: 0,
};

export const useCreatePrediction = () => {
  const { library, account } = useWeb3React();
  const navigate = useNavigate();

  console.log("library:", library);

  const reducer = (
    state: ICreatePrediction,
    action: { type: keyof ICreatePrediction | "init"; payload: ICreatePrediction }
  ) => {
    const { type, payload } = action;
    switch (type) {
      case "init":
        return payload;
      case "step":
        return { ...state, step: payload.step };
      case "betContract":
        return { ...state, betContract: payload.betContract };
      case "isCounterParty":
        return { ...state, isCounterParty: payload.isCounterParty };
      case "loading":
        return { ...state, loading: payload.loading };
      case "deadline":
        return { ...state, deadline: payload.deadline };
      default:
        throw new Error("invalid action type for WalletContext");
    }
  };
  const [createPredictionState, dispatch] = useReducer(reducer, initialCreatePredictionState);

  const initCreatePrediction = (state: ICreatePrediction) =>
    dispatch({ type: "init", payload: state });
  const setStep = (step: CreatePredictionStep) =>
    dispatch({ type: "step", payload: { ...createPredictionState, step } });
  const setBetContract = (betContract: Contract) =>
    dispatch({ type: "betContract", payload: { ...createPredictionState, betContract } });
  const setIsCounterParty = (isCounterParty: boolean) =>
    dispatch({ type: "isCounterParty", payload: { ...createPredictionState, isCounterParty } });
  const setLoading = (loading: boolean) =>
    dispatch({ type: "loading", payload: { ...createPredictionState, loading } });
  const setDeadline = (deadline: number) =>
    dispatch({ type: "deadline", payload: { ...createPredictionState, deadline } });

  const getStep = async (curBet: Contract) => {
    const counterPartyAddress = await curBet.counter_party();
    setIsCounterParty(counterPartyAddress === account);

    const starterPaid = await curBet.starter_paied();
    // setStarterPaid(starterPaid);
    const counterPartyPaid = await curBet.counter_party_paied();
    // setCounterPaid(counterPartyPaid);
    if (!starterPaid || !counterPartyPaid) {
      setStep(CreatePredictionStep.SharePrediction);
      return;
    }

    const deadline = (await curBet.deadline()).toNumber();
    setDeadline(deadline);
    const isEnd = deadline < Date.now();
    if (isEnd) {
      setStep(CreatePredictionStep.PredictionResult);
      return;
    }

    setStep(CreatePredictionStep.StartPrediction);
  };

  const init = async () => {
    if (!library) return;
    setLoading(true);
    try {
      const signer = library.getSigner();
      const result = await getCurrentBet(signer);
      if (!result) return;
      const curBet = await getBetContract(signer, result);
      setBetContract(curBet);

      navigate(ROUTERS.MY_PREDICTION);
      await getStep(curBet);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [library]);

  return {
    createPredictionState,
    initCreatePrediction,
    setStep,
    // setBetContract,
    // setIsCounterParty,
    // setLoading,
    // setDeadline,
  };
};
