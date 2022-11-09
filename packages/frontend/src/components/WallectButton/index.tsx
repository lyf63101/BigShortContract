import { useEagerConnect, useInactiveListener } from "@hooks/useWallet";
import { useWeb3React } from "@web3-react/core";
import { Button, Popover } from "antd";
import { useState, useEffect } from "react";
import css from "./index.module.less";
import { injectedConnector } from "@hooks/useWallet";
import { InjectedConnector } from "@web3-react/injected-connector";
import { briefAddress } from "@utils/briefAddress";

const WallectButton = () => {
  const { connector, account, activate, deactivate, error } = useWeb3React();
  const triedEager = useEagerConnect();
  const [activatingConnector, setActivatingConnector] = useState<InjectedConnector | undefined>(
    undefined
  );

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const activating = injectedConnector === activatingConnector;
  const connected = injectedConnector === connector;
  const disabled = !triedEager || !!activatingConnector || !!error;

  useInactiveListener(!triedEager || !!activatingConnector);

  // const isDisconnect = !error && chainId;

  const handleConnect = async () => {
    await activate(injectedConnector);
    setActivatingConnector(injectedConnector);
  };

  if (connected) {
    return (
      <Popover content="disconnect">
        <Button type="primary" size="large" onClick={deactivate} className={css.wrapper}>
          {briefAddress(account)}
        </Button>
      </Popover>
    );
  }

  return (
    <Button
      type="primary"
      size="large"
      onClick={handleConnect}
      disabled={disabled}
      loading={activating}
      className={css.wrapper}
    >
      {activating ? "Connectting" : "Connect Your Wallet"}
    </Button>
  );
};

export default WallectButton;
