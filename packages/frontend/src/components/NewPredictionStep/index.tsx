import { ROUTERS } from "@constants/router";
import { Popover, Steps, StepsProps } from "antd";
import { useMatch } from "react-router-dom";
import css from "./index.module.less";

const { Step } = Steps;

const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const NewPredictionStep = () => {
  const routerMatch = useMatch(ROUTERS.NEW_PREDICATION);
  // console.log(routerMatch);
  if (!routerMatch) return null;
  return (
    <div className={css.steps}>
      <Steps direction="vertical" current={1} progressDot={customDot}>
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
