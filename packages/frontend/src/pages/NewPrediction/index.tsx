import CreatePrediction from "@components/CreatePrediction";
import NewPredictionStep from "@components/NewPredictionStep";
// import PredictionResult from "@components/PredictionResult";
// import PredictionStart from "@components/PredictionStart";
// import SharePrediction from "@components/SharePrediction";
import { useContractContext } from "@hooks/useBetContract/CreateContractProvider";
import { Spin } from "antd";
import css from "./index.module.less";

const NewPrediction = () => {
  const { createPredictionState, setStep } = useContractContext();

  const { loading, step } = createPredictionState;

  return (
    <Spin spinning={loading}>
      <div className={css.wrapper}>
        <div className={css.steps}>
          <NewPredictionStep step={step} setStep={setStep} />
        </div>
        <div className={css.content}>
          <CreatePrediction nextStep={() => setStep(1)} />
        </div>
      </div>
    </Spin>
  );

  // return (
  //   <Spin spinning={loading}>
  //     <div className={css.wrapper}>
  //       <div className={css.steps}>
  //         <NewPredictionStep step={step} setStep={setStep} />
  //       </div>
  //       <div className={css.content}>
  //         {step === 0 && <CreatePrediction nextStep={() => setStep(1)} />}
  //         {step === 1 && betContract && (
  //           <SharePrediction
  //             nextStep={() => setStep(2)}
  //             isCounterParty={isCounterParty}
  //             betContract={betContract}
  //           />
  //         )}
  //         {step === 2 && betContract && (
  //           <PredictionStart
  //             nextStep={() => setStep(3)}
  //             betContract={betContract}
  //             deadline={deadline}
  //           />
  //         )}
  //         {step === 3 && betContract && (
  //           <PredictionResult
  //             nextStep={() => setStep(3)}
  //             betContract={betContract}
  //             isCounterParty={isCounterParty}
  //           />
  //         )}
  //       </div>
  //     </div>
  //   </Spin>
  // );
};

export default NewPrediction;
