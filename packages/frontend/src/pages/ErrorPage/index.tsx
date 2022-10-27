import { ROUTERS } from "@constants/router";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate(ROUTERS.HOME);
  };
  return <div onClick={goHome}>error page</div>;
};

export default ErrorPage;
