import { FC } from "react";
import css from "./index.module.less";

const PredictionStart: FC<{ nextStep: () => void }> = () => {
  return <div className={css.wrapper}>PredictionStart</div>;
};

export default PredictionStart;
