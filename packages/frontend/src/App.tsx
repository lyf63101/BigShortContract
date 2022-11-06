import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTERS } from "@constants/router";
import Home from "@pages/Home";
import NewPrediction from "@pages/NewPrediction";
import MyPrediction from "@pages/MyPrediction";
import ErrorPage from "@pages/ErrorPage";
import BaseLayout from "@layout/baseLayout";
import { WalletProvider } from "@hooks/useWallet/WalletProvider";

const App: FC<Record<string, unknown>> = () => {
  return (
    <div>
      <WalletProvider>
        <BrowserRouter>
          <BaseLayout>
            <Routes>
              <Route path={ROUTERS.HOME} element={<Home />} />
              <Route path={ROUTERS.NEW_PREDICATION} element={<NewPrediction />} />
              <Route path={ROUTERS.MY_PREDICATION} element={<MyPrediction />} />
              <Route path={ROUTERS.ERROR} element={<ErrorPage />} />
              <Route path="/*" element={<Home />} />
              <Route path="/*" element={<Navigate to={ROUTERS.ERROR} />} />
            </Routes>
          </BaseLayout>
        </BrowserRouter>
      </WalletProvider>
    </div>
  );
};

export default App;
