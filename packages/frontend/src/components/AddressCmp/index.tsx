import useEtherScanUrl from "@hooks/useEtherScanUrl";
import { getAddressExploreUrl } from "@utils/getAddressExploreUrl";
import { message } from "antd";
import { FC } from "react";
import css from "./index.module.less";

const AddressCmp: FC<{ address: string }> = ({ address }) => {
  const etherScanUrl = useEtherScanUrl();

  const exploreAddress = () => {
    if (!etherScanUrl) {
      message.warn("invalid etherscan url");
      return;
    }
    const url = getAddressExploreUrl(etherScanUrl, address);
    window.open(url, "_blank");
  };

  return (
    <span className={css.wrapper} onClick={exploreAddress}>
      {address}
    </span>
  );
};

export default AddressCmp;
