import { Button } from "antd";

export const SubmitButton = ({ loading, text, func, icon, fullWidth }) => {
  return (
    <Button
      htmlType="submit"
      size="large"
      type="primary"
      loading={loading}
      icon={icon}
      onClick={func}
      className={`bg-primary hover:bg-secondary font-bold px-10 ${
        fullWidth && "w-full"
      }`}
    >
      {text}
    </Button>
  );
};

export const DeleteButton = ({ loading, text, func }) => {
  return (
    <Button
      htmlType="submit"
      type="primary"
      size="large"
      loading={loading}
      onClick={func}
      className="bg-primary font-bold px-10"
    >
      {text}
    </Button>
  );
};
