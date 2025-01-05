import { DatePicker, Form } from "antd";
const { RangePicker } = DatePicker;

const CustomDateRange = ({ name, label, placeholder, required }) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: `${label} is required` }]}
    >
      <RangePicker
        size="large"
        allowClear
        placeholder={placeholder}
        required={required}
        className="w-full"
      />
    </Form.Item>
  );
};

export default CustomDateRange;
