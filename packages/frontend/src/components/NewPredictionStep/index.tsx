import { ROUTERS } from "@constants/router";
import { Steps } from "antd";
import { FC } from "react";
import { useMatch } from "react-router-dom";
import css from "./index.module.less";

const { Step } = Steps;

export type StepNum = 0 | 1 | 2 | 3;

const NewPredictionStep: FC<{ step: StepNum; setStep: (v: StepNum) => void }> = ({
  step,
  setStep,
}) => {
  const routerMatch = useMatch(ROUTERS.MY_PREDICATION);
  if (!routerMatch) return null;
  return (
    <div className={css.steps}>
      <Steps
        direction="vertical"
        current={step}
        progressDot
        onChange={(val) => setStep(val as StepNum)}
      >
        <Step
          title="Step 1:  Create  Prediction"
          description={<div className={css.contentPadding} />}
          // description="This is a description."
        />
        <Step
          title="Step 2:  Share  your prediction to your counterparty  and send token to the contract to initial"
          description={<div className={css.contentPadding} />}
          // description="This is a description."
        />
        <Step
          title="Step 3:  Prediction protocol starts"
          description={<div className={css.contentPadding} />}
          // description="This is a description."
        />
        <Step
          title="Step 4:  Prediction protocol ends and winner claims token "
          description={<div className={css.contentPadding} />}
          // description="This is a description."
        />
      </Steps>
    </div>
  );
};

export default NewPredictionStep;
