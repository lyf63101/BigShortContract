import { getBetContract } from "@apis/getBetContract";
import { getCurrentBet } from "@apis/getCurrentBet";
import CreatePrediction from "@components/CreatePrediction";
import NewPredictionStep, { StepNum } from "@components/NewPredictionStep";
import PredictionResult from "@components/PredictionResult";
import PredictionStart from "@components/PredictionStart";
import SharePrediction from "@components/SharePrediction";
import { handleError } from "@utils/handleError";
import { useWeb3React } from "@web3-react/core";
import { Spin } from "antd";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import css from "./index.module.less";

const NewPrediction = () => {
  const [step, setStep] = useState<StepNum>(0);
  const [isCounterParty, setIsCounterParty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(0);
  const { library, account } = useWeb3React();
  const [betContract, setBetContract] = useState<Contract | null>(null);

  const getStep = async (curBet: Contract) => {
    const counterPartyAddress = await curBet.counter_party();
    setIsCounterParty(counterPartyAddress === account);

    const starterPaid = await curBet.starter_paied();
    // setStarterPaid(starterPaid);
    const counterPartyPaid = await curBet.counter_party_paied();
    // setCounterPaid(counterPartyPaid);
    if (!starterPaid || !counterPartyPaid) {
      setStep(1);
      return;
    }

    const deadline = (await curBet.deadline()).toNumber();
    setDeadline(deadline);
    const isEnd = deadline > Date.now();
    if (isEnd) {
      setStep(3);
      return;
    }

    setStep(2);
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
  return (
    <Spin spinning={loading}>
      <div className={css.wrapper}>
        <div className={css.steps}>
          <NewPredictionStep step={step} setStep={setStep} />
        </div>
        <div className={css.content}>
          {step === 0 && <CreatePrediction nextStep={() => setStep(1)} />}
          {step === 1 && betContract && (
            <SharePrediction
              nextStep={() => setStep(2)}
              isCounterParty={isCounterParty}
              betContract={betContract}
            />
          )}
          {step === 2 && betContract && (
            <PredictionStart
              nextStep={() => setStep(3)}
              betContract={betContract}
              deadline={deadline}
            />
          )}
          {step === 3 && betContract && (
            <PredictionResult
              nextStep={() => setStep(3)}
              betContract={betContract}
              isCounterParty={isCounterParty}
            />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default NewPrediction;
