import { Form } from "antd";
import { toast } from "sonner";

const CustomForm = ({ onSubmit, children, fields }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => {
        onSubmit(values);
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };

  const onFinishFailed = () => {
    toast.error("Please Select All The Fields");
  };

  return (
    <Form
      form={form}
      fields={fields}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      autoComplete="on"
    >
      {children}
    </Form>
  );
};

export default CustomForm;
