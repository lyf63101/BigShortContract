import { getAddressExploreUrl } from "@utils/getAddressExploreUrl";
import { handleError } from "@utils/handleError";
import { Button } from "antd";
import { Contract } from "ethers";
import { FC, useState } from "react";
import css from "./index.module.less";

const PredictionResult: FC<{ nextStep: () => void; betContract: Contract }> = ({ betContract }) => {
  const [loading, setLoading] = useState(false);
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
  const seeContract = () => {
    const url = getAddressExploreUrl(betContract.address);
    window.open(url, "_blank");
  };
  return (
    <div className={css.wrapper}>
      <div className={css.contentLine}>
        <span>
          In 2022-07-22 12:00 am UTC, if ETH price is higher or equal than 2000.00 USD , address
          0xf584F8728B874a6a5c7A8d4d387C9aae9172D621 will send 20,000.00 USDC to
        </span>
      </div>
      <div className={css.contentLine}>
        0x3ddfa8ec3052539b6c9549f12cea2c295cff5296. If ETH price is lower than 2000.00 USD, then
        0x3ddfa8ec3052539b6c9549f12cea2c295cff5296 will send 20,000.00 USDC to
        0xf584F8728B874a6a5c7A8d4d387C9aae9172D621.
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
