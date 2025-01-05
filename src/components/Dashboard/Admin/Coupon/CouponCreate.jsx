import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddCouponMutation } from "@/redux/services/coupon/couponAPi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import CouponForm from "./CouponForm";
import dayjs from "dayjs";
import { compressImage } from "@/utilities/lib/compressImage";

const CouponCreate = ({ open, setOpen }) => {
  const [addGiftCard, { isLoading }] = useAddCouponMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Coupon...");

    try {
      const submittedData = {
        ...values,
        expiredDate: dayjs(values.expiredDate).format("YYYY-MM-DD"),
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addGiftCard(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Coupon:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Coupon">
      <CustomForm onSubmit={onSubmit}>
        <CouponForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default CouponCreate;
