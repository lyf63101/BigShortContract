import { getAddressExploreUrl } from "@utils/getAddressExploreUrl";
import { Button, Input, message } from "antd";
import { Contract } from "ethers";
import { FC, useEffect, useMemo, useState } from "react";
import css from "./index.module.less";
import copy from "copy-to-clipboard";
import { handleError } from "@utils/handleError";
import { approveUSDC } from "@apis/approveUSDC";
import { useWeb3React } from "@web3-react/core";

const SharePrediction: FC<{
  nextStep: () => void;
  isCounterParty: boolean;
  betContract: Contract;
}> = ({ betContract, isCounterParty }) => {
  const { library } = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [pricePrediction, setPricePrediction] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isHigher, setIsHigher] = useState(false);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setLoading(true);
      if (isCounterParty) {
      }
      const isPaid = isCounterParty
        ? await betContract.counter_party_paied()
        : await betContract.starter_paied();
      setIsPaid(isPaid);
      const amount = await betContract.amount();
      setAmount(amount.toNumber());
      const isHigher = await betContract.higherOrEqual();
      setIsHigher(isHigher);
      const pricePrediction = await betContract.pricePrediction();
      setPricePrediction(pricePrediction.toNumber());
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const payTheBet = async () => {
    if (!library) return;
    try {
      setLoading(true);
      const signer = library.getSigner();
      const { hash } = await approveUSDC(signer, { amount });
      await (await library.getTransaction(hash)).wait();
      console.log("approve end");
      if (isCounterParty) {
        await betContract.counterPartyPay();
      } else {
        await betContract.starterPay();
      }
      // TODO: 优化 reload
      window.location.reload();
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const seeContract = () => {
    const url = getAddressExploreUrl(betContract.address);
    window.open(url, "_blank");
  };

  const higherOrLower = useMemo(() => {
    if (isCounterParty) {
      if (isHigher) return "lower";
      return "higher or equal";
    } else {
      if (isHigher) return "higher or equal";
      return "lower";
    }
  }, [isHigher, isCounterParty]);

  return (
    <div className={css.wrapper}>
      <div className={css.shareLine}>
        <Input.Group compact>
          <Input style={{ width: "calc(100% - 100px)" }} value={window.location.href} />
          <Button
            type="primary"
            onClick={() => {
              if (copy(window.location.href)) {
                message.success("copy success");
              } else {
                message.error("failed to copy the share link");
              }
            }}
          >
            Copy
          </Button>
        </Input.Group>
      </div>
      <div className={css.content1}>
        <div>Copy this link and send it to your counterparty ,</div>
        <div>he/she needs to connect his wallet to confirm the prediction</div>
      </div>
      <div className={css.content2}>
        <div>
          You win if ETH price is {higherOrLower} than ${pricePrediction}.
        </div>
        <div>
          Stake ${amount} To Win ${amount}
        </div>
      </div>
      <div className={css.button}>
        {isPaid ? (
          <Button type="primary" loading={loading} onClick={seeContract}>
            Check Contract on chain
          </Button>
        ) : (
          <Button type="primary" loading={loading} onClick={payTheBet}>
            Paid to accept the bet
          </Button>
        )}
      </div>
      <div className={css.content3}>
        <div>
          You and your counterparty need to send tokne to the contract to initial the contract, if
          the token is not received within 7 days of the contract, the token will be returned the
          sending addresss
        </div>
      </div>
    </div>
  );
};

export default SharePrediction;
