import { FC } from "react";
import css from "./index.module.less";

const PredictionResult: FC<{ nextStep: () => void }> = () => {
  return <div className={css.wrapper}>PredictionResult</div>;
};

export default PredictionResult;
