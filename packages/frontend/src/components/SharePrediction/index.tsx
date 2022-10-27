import { FC } from "react";
import css from "./index.module.less";

const SharePrediction: FC<{ nextStep: () => void }> = () => {
  return <div className={css.wrapper}>SharePrediction</div>;
};

export default SharePrediction;
