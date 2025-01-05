import CustomButtonInput from "@/components/Reusable/Form/CustomButtonInput";
import CustomDatePicker from "@/components/Reusable/Form/CustomDatePicker";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { Form } from "antd";
import { RiRefreshLine } from "react-icons/ri";

const GiftCardForm = ({ attachment }) => {
  const form = Form.useFormInstance();

  const generateRandomCode = () => {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `VGC-${randomNumbers}`;
  };

  const generate = () => {
    const randomCode = generateRandomCode();
    form.setFieldsValue({ code: randomCode });
  };

  return (
    <>
      <div className="two-grid">
        <CustomInput
          label={"Gift Card Name"}
          name={"name"}
          type={"text"}
          required={true}
        />
        <CustomButtonInput
          label="Gift Card Code"
          type={"text"}
          required={false}
          name={"code"}
          placeholder={"Generate Gift Card Code"}
          onClick={generate}
          icon={<RiRefreshLine className="text-xl" />}
        />
      </div>

      <div className="three-grid">
        <CustomInput
          label={"Gift Card Count"}
          name={"count"}
          type={"number"}
          required={true}
        />

        <CustomInput
          label={"Amount"}
          name={"amount"}
          type={"number"}
          required={true}
        />
        <CustomDatePicker
          label={"Expired Date"}
          name={"expiredDate"}
          required={true}
        />
      </div>

      <FileUploader
        defaultValue={attachment}
        label="Gift Card Image"
        name="attachment"
      />
    </>
  );
};

export default GiftCardForm;
