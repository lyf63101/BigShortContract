import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import css from "./index.module.less";
import { Statistic } from "antd";
import { Contract } from "ethers";
import { getAddressExploreUrl } from "@utils/getAddressExploreUrl";
import { useCountdown } from "usehooks-ts";
import dayjs from "dayjs";

const getCountDown = (seconds: number, deadline: number) => {
  const end = dayjs(seconds * 1000);
  const now = dayjs(deadline);
  return `${now.diff(end, "day")} day ${now.diff(end, "hour") % 24} h ${
    now.diff(end, "minute") % 60
  } m ${now.diff(end, "second") % 60} s`;
};

const PredictionStart: FC<{ nextStep: () => void; betContract: Contract; deadline: number }> = ({
  betContract,
  deadline,
}) => {
  const [counterParty, setCounterParty] = useState("");
  const [starter, setStarter] = useState("");
  const [isHigher, setIsHigher] = useState(false);
  const [latestPrice, setLatestPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    betContract.counter_party().then(setCounterParty);
    betContract.starter().then(setStarter);
    betContract.higherOrEqual().then(setIsHigher);
    betContract
      .getLatestPrice()
      .then((res: any) => res.toNumber() / 1e8)
      .then(setLatestPrice);
    betContract
      .amount()
      .then((res: any) => res.toNumber())
      .then(setAmount);
  }, []);
  const seeContract = () => {
    const url = getAddressExploreUrl(betContract.address);
    window.open(url, "_blank");
  };

  const [seconds, { startCountdown }] = useCountdown({
    countStart: Date.now() / 1000,
    intervalMs: 1000,
    isIncrement: true,
    countStop: deadline / 1000,
  });

  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div className={css.wrapper}>
      <div className={css.contentLine}>
        <span>
          In 2022-07-22 12:00 am UTC, if ETH price is higher or equal than 2000.00 USD , address{" "}
          {betContract.address} will send 20,000.00 USDC to {isHigher ? starter : counterParty}. If
          ETH price is lower than 2000.00 USD, then {betContract.address} will send 20,000.00 USDC
          to {isHigher ? counterParty : starter}.
        </span>
      </div>
      <div className={css.button}>
        <Button type="primary" onClick={seeContract}>
          Check Contract on chain
        </Button>
      </div>
      <div className={css.bottomArea}>
        <div className={css.countDown}>
          <div className={css.title}>Countdown</div>
          <div>
            <Statistic title="count down" value={getCountDown(seconds, deadline)} />
          </div>
        </div>
        <div className={css.currentPrice}>
          <div className={css.title}>
            <div>Current Price:</div>
            <div>{latestPrice.toFixed(2)} ETH / USD</div>
          </div>
          <div>
            <Statistic title="Account Balance (USD)" value={amount} precision={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionStart;
