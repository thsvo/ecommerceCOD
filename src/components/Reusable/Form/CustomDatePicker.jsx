import { DatePicker, Form } from "antd";
const CustomDatePicker = ({
  name,
  label,
  placeholder,
  required,
  picker,
  format,
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: `${label} is required` }]}
    >
      <DatePicker
        size="large"
        allowClear
        picker={picker}
        placeholder={placeholder ? placeholder : `Please Select ${label}`}
        format={format}
        className="w-full"
      />
    </Form.Item>
  );
};

export default CustomDatePicker;
