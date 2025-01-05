import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { ColorPicker, Form, Radio } from "antd";

const AttributeOptionForm = ({ attachment }) => {
  const form = Form.useFormInstance();

  const type = Form.useWatch("type", form);

  const handleColorChange = (color) => {
    const colorCode = color.toHexString();
    form.setFieldsValue({ label: colorCode });
  };

  return (
    <>
      <CustomInput
        label={"Attribute Option Name"}
        name={"name"}
        type={"text"}
        required={true}
      />

      <Form.Item name="type" label="Type" required>
        <Radio.Group>
          <Radio value="color">Color</Radio>
          <Radio value="other">Other</Radio>
        </Radio.Group>
      </Form.Item>

      {type === "color" && (
        <Form.Item name="color" label="Color">
          <ColorPicker
            defaultValue="#22C55E"
            showText
            onChange={(value) => handleColorChange(value)}
          />
        </Form.Item>
      )}

      {type && (
        <CustomInput
          label={type === "other" ? "Other Label" : "Color Label"}
          type="text"
          name="label"
        />
      )}

      <FileUploader
        defaultValue={attachment}
        label="Attribute Option Image"
        name="attachment"
      />
    </>
  );
};

export default AttributeOptionForm;
