import { AppstoreOutlined, RocketOutlined } from "@ant-design/icons";
import { ROUTERS } from "@constants/router";
import { Button, Menu, MenuProps } from "antd";
import { FC, ReactNode, useState } from "react";
import { useMatch, useLocation, useNavigate } from "react-router-dom";
import css from "./index.module.less";

const items: MenuProps["items"] = [
  {
    label: "New Prediction",
    key: ROUTERS.NEW_PREDICATION,
    icon: <RocketOutlined />,
  },
  {
    label: "My Prediction",
    key: ROUTERS.MY_PREDICATION,
    icon: <AppstoreOutlined />,
  },
];

const BaseLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const routerMatch = useMatch(ROUTERS.HOME);
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const navigate = useNavigate();
  console.log(routerMatch);

  const onClick: MenuProps["onClick"] = (e) => {
    // console.log("click ", e);
    setCurrent(e.key);
    navigate(e.key);
  };
  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <div className={css.left}>
          <div className={css.logo}>BigShort Protocol</div>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </div>
        <div className={css.rightButton}>
          <Button size="large">Documentation</Button>
          <Button type="primary" size="large">
            Connect Your Wallet
          </Button>
        </div>
      </div>
      <div className={css.body}>{children}</div>
    </div>
  );
};

export default BaseLayout;
