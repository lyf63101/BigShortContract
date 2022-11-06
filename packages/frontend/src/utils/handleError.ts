import { message } from "antd";

export const handleError = (error: Error, errorStep?: string) => {
  console.error(`${errorStep} error:`, error);
  message.error(error.message);
};
