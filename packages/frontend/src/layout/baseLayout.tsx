import { AppstoreOutlined, RocketOutlined } from "@ant-design/icons";
import WallectButton from "@components/WallectButton";
import { ROUTERS } from "@constants/router";
import { Button, Menu, MenuProps } from "antd";
import { FC, ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
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
        <div>
          <Button size="large">Documentation</Button>
          <WallectButton />
        </div>
      </div>
      <div className={css.body}>{children}</div>
    </div>
  );
};

export default BaseLayout;
