import CustomButtonInput from "@/components/Reusable/Form/CustomButtonInput";
import CustomDatePicker from "@/components/Reusable/Form/CustomDatePicker";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { Form } from "antd";
import { useEffect } from "react";
import { RiRefreshLine } from "react-icons/ri";

const CouponForm = ({ attachment, edit }) => {
  const form = Form.useFormInstance();

  const type = Form.useWatch("type", form);

  const generateRandomCode = () => {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `VC-${randomNumbers}`;
  };

  const generate = () => {
    const randomCode = generateRandomCode();
    form.setFieldsValue({ code: randomCode });
  };

  useEffect(() => {
    if (!edit) {
      form.setFieldValue("type", "fixed");
    }
  }, [edit, form]);

  return (
    <>
      <div className="two-grid">
        <CustomInput
          label={"Coupon Name"}
          name={"name"}
          type={"text"}
          required={true}
        />
        <CustomButtonInput
          label="Coupon Code"
          type={"text"}
          name={"code"}
          placeholder={"Generate Coupon Code"}
          onClick={generate}
          icon={<RiRefreshLine className="text-xl" />}
        />
      </div>

      <div className="two-grid">
        <CustomInput
          label={"Coupon Count"}
          name={"count"}
          type={"number"}
          required={true}
        />
        <CustomInput
          label={"Minimum Purchase Amount"}
          name={"minimumAmount"}
          type={"number"}
          required={true}
        />
      </div>
      <div className="three-grid">
        <CustomSelect
          name={"type"}
          label={"Amount Type"}
          options={[
            { value: "fixed", label: "Fixed" },
            { value: "percentage", label: "Percentage" },
          ]}
        />
        <CustomInput
          label={"Amount"}
          name={"amount"}
          type={type === "percentage" ? "text" : "number"}
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
        label="Coupon Image"
        name="attachment"
      />
    </>
  );
};

export default CouponForm;
