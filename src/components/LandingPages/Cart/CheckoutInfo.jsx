import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { Form } from "antd";

const CheckoutInfo = () => {
  const form = Form.useFormInstance();
  const paymentType = Form.useWatch("paymentType", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const paymentOptions = [
    { value: "manual", label: "Manual" },
    { value: "cod", label: "Cash on Delivery" },
    ...(globalData?.results?.ssl === "Active"
      ? [{ value: "ssl", label: "SSL Commerz" }]
      : []),
  ];

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />
      <CustomSelect
        name={"paymentType"}
        label={"Payment Type"}
        options={paymentOptions}
        required
      />

      {paymentType === "manual" && (
        <div>
          <CustomSelect
            name={"paymentMethod"}
            label={"Payment Method"}
            options={[
              { value: "bkash", label: "Bkash" },
              { value: "nagad", label: "Nagad" },
              { value: "rocket", label: "Rocket" },
              { value: "upay", label: "Upay" },
            ]}
            required
          />
          <CustomInput
            type="text"
            name="tranId"
            label="Transaction ID"
            required
          />
        </div>
      )}

      <SubmitButton fullWidth text="Order Now" />
    </div>
  );
};

export default CheckoutInfo;
