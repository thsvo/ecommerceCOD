import { Button, Form, Input, Space } from "antd";

const CustomButtonInput = (props) => {
  const {
    type,
    name,
    label,
    placeholder,
    required = false,
    requireMsg = undefined,
    onClick,
    icon,
    btnText,
  } = props;

  return (
    <Form.Item label={label} required={required}>
      <Space.Compact style={{ width: "100%" }}>
        <Form.Item
          name={name}
          rules={[
            {
              required: required,
              message: `${requireMsg ?? label} is required`,
            },
          ]}
          noStyle
        >
          <Input
            type={type}
            placeholder={`${placeholder ?? "Please Enter" + label}`}
            size="large"
            style={{
              allowClear: true,
            }}
            autoComplete="off"
          />
        </Form.Item>
        <Button
          onClick={onClick}
          icon={icon}
          className="flex items-center justify-center border-2"
          size="large"
        >
          {btnText}
        </Button>
      </Space.Compact>
    </Form.Item>
  );
};

export default CustomButtonInput;
