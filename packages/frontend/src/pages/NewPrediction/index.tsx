import CreatePrediction from "@components/CreatePrediction";
import NewPredictionStep, { StepNum } from "@components/NewPredictionStep";
import PredictionResult from "@components/PredictionResult";
import PredictionStart from "@components/PredictionStart";
import SharePrediction from "@components/SharePrediction";
import { useState } from "react";
import css from "./index.module.less";

const NewPrediction = () => {
  const [step, setStep] = useState<StepNum>(0);
  return (
    <div className={css.wrapper}>
      <div className={css.steps}>
        <NewPredictionStep step={step} setStep={setStep} />
      </div>
      <div className={css.content}>
        {step === 0 && <CreatePrediction nextStep={() => setStep(1)} />}
        {step === 1 && <SharePrediction nextStep={() => setStep(2)} />}
        {step === 2 && <PredictionStart nextStep={() => setStep(3)} />}
        {step === 3 && <PredictionResult nextStep={() => setStep(3)} />}
      </div>
    </div>
  );
};

export default NewPrediction;
