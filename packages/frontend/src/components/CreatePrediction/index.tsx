import { FC, useState } from "react";
import css from "./index.module.less";
import { Form, Input, Popover, DatePicker, Radio, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { createBet } from "@apis/createBet";
import { handleError } from "@utils/handleError";

const FormItem = Form.Item;

const CreatePrediction: FC<{ nextStep: () => void }> = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { connector, library, account } = useWeb3React();

  const createPrediction = async () => {
    if (!library) return;
    setLoading(true);
    try {
      const formData = await form.validateFields();
      // @ts-ignore
      window.library = library;
      const payload = {
        counter_party: formData.counter_party,
        predicted_price: Number(formData.predicted_price) || 0,
        deadline: formData.deadline.valueOf() || 0,
        higherOrEqual: formData.higherOrEqual,
        amount: Number(formData.predicted_price) || 0,
      };
      const signer = library.getSigner();
      const txHash = await createBet(signer, payload);
      await (await library.getTransaction(txHash)).wait();
      // TODO: 优化 reload
      window.location.reload();
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        initialValues={{
          counter_party: "",
          deadline: undefined,
          predicted_price: undefined,
          higherOrEqual: undefined,
          amount: undefined,
        }}
      >
        <FormItem
          label={
            <span>
              Your address
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <Input value={account || ""} disabled />
        </FormItem>
        <FormItem
          name="counter_party"
          required
          label={
            <span>
              Counter party address
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <Input />
        </FormItem>
        <FormItem
          name="deadline"
          required
          label={
            <span>
              End Date
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <DatePicker showTime />
        </FormItem>
        <FormItem
          name="predicted_price"
          required
          label={
            <span>
              ETH Price prediction on End Time in USD
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <Input />
        </FormItem>
        <FormItem
          name="higherOrEqual"
          required
          label={
            <span>
              I predict at the end time the ETH price will be
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <Radio.Group>
            <Radio value={false}>Higher or equal</Radio>
            <Radio value={true}>Lower than prediction price</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          name="amount"
          required
          label={
            <span>
              Contract SIZE in USDC
              <Popover>
                <QuestionCircleOutlined className={css.infoIcon} />
              </Popover>
            </span>
          }
        >
          <Input />
        </FormItem>
      </Form>
      <div className={css.bottomSubmit}>
        <span>You win if ETH price is XXXX than XXXXX. </span>
      </div>
      <div className={css.bottomSubmit}>
        <span>Stake $XXXX TO Win $XXXX</span>
      </div>
      <div className={css.bottomSubmit}>
        <Button type="primary" disabled={!connector} loading={loading} onClick={createPrediction}>
          Generate Prediction
        </Button>
      </div>
    </div>
  );
};

export default CreatePrediction;
