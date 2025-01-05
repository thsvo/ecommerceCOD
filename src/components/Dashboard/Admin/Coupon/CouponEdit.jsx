import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
} from "@/redux/services/coupon/couponAPi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CouponForm from "./CouponForm";
import dayjs from "dayjs";
import { compressImage } from "@/utilities/lib/compressImage";

const CouponEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: couponData, isFetching: isCouponFetching } =
    useGetSingleCouponQuery(itemId, {
      skip: !itemId,
    });

  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Coupon...");
    try {
      const submittedData = {
        ...values,
        expiredDate: dayjs(values.expiredDate).format("YYYY-MM-DD"),
        user: values?.user ? values.user : undefined,
      };

      if (
        values?.attachment &&
        Array.isArray(values.attachment) &&
        !values.attachment[0]?.url
      ) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      } else {
        delete submittedData.attachment;
      }

      const updatedCategoryData = new FormData();
      appendToFormData(submittedData, updatedCategoryData);

      const updatedData = {
        id: itemId,
        data: updatedCategoryData,
      };

      const res = await updateCoupon(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Coupon:", error);
      toast.error("An error occurred while updating the Coupon.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(couponData, [
        {
          name: "user",
          value: couponData?.user?._id,
          errors: "",
        },
      ])
    );
  }, [couponData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Coupon"
      placement={"left"}
      loading={isCouponFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <CouponForm attachment={couponData?.attachment} edit={true} />

        <CustomSelect
          name={"status"}
          label={"Status"}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default CouponEdit;
