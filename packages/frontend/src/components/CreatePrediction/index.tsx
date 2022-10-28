import { FC } from "react";
import css from "./index.module.less";

const CreatePrediction: FC<{ nextStep: () => void }> = () => {
  return <div className={css.wrapper}>CreatePrediction</div>;
};

export default CreatePrediction;
