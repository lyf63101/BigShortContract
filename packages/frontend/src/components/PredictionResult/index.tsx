import AddressCmp from "@components/AddressCmp";
import useEtherScanUrl from "@hooks/useEtherScanUrl";
import { getAddressExploreUrl } from "@utils/getAddressExploreUrl";
import { handleError } from "@utils/handleError";
import { Button, message } from "antd";
import { Contract } from "ethers";
import { FC, useEffect, useMemo, useState } from "react";
import css from "./index.module.less";

const PredictionResult: FC<{
  nextStep: () => void;
  betContract: Contract;
  isCounterParty: boolean;
}> = ({ betContract }) => {
  const [loading, setLoading] = useState(false);
  const [counterParty, setCounterParty] = useState("");
  const [starter, setStarter] = useState("");
  const [isHigher, setIsHigher] = useState(false);
  const [pricePrediction, setPricePrediction] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    betContract.counter_party().then(setCounterParty);
    betContract.starter().then(setStarter);
    betContract.higherOrEqual().then(setIsHigher);
    betContract
      .pricePrediction()
      .then((res: any) => res.toNumber().toFixed(2))
      .then(setPricePrediction);
    betContract
      .amount()
      .then((res: any) => res.toNumber().toFixed(2))
      .then(setAmount);
  }, []);

  const claimToken = async () => {
    try {
      setLoading(true);
      await betContract.claimRewards();
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const etherScanUrl = useEtherScanUrl();

  const seeContract = () => {
    if (!etherScanUrl) {
      message.warn("invalid etherscan url");
      return;
    }
    const url = getAddressExploreUrl(etherScanUrl, betContract.address);
    window.open(url, "_blank");
  };

  const [higher, lower] = useMemo(() => {
    if (isHigher) return [starter, counterParty];
    return [counterParty, starter];
  }, [isHigher, counterParty, starter]);

  return (
    <div className={css.wrapper}>
      <div className={css.contentLine}>
        <span>
          In 2022-07-22 12:00 am UTC, if ETH price is higher or equal than {pricePrediction} USD ,
          then address <AddressCmp address={higher} /> will send {amount} USDC to
          <AddressCmp address={lower} />.
        </span>
      </div>
      <div className={css.contentLine}>
        <span>
          If ETH price is lower than {pricePrediction} USD, then address
          <AddressCmp address={lower} /> will send {amount} USDC to <AddressCmp address={higher} />.
        </span>
      </div>
      <div className={css.resultLine}>
        <span>Winner is address: XXXXXX</span>
      </div>
      <div className={css.buttonLine}>
        <Button type="primary" className={css.leftBotton} onClick={claimToken} loading={loading}>
          Claim the token
        </Button>
        <Button type="primary" onClick={seeContract}>
          Check on chain
        </Button>
      </div>
    </div>
  );
};

export default PredictionResult;
