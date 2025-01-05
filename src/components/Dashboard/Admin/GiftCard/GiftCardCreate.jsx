import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddGiftCardMutation } from "@/redux/services/giftCard/giftCardApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import GiftCardForm from "./GiftCardForm";
import { compressImage } from "@/utilities/lib/compressImage";
import dayjs from "dayjs";

const GiftCardCreate = ({ open, setOpen }) => {
  const [addGiftCard, { isLoading }] = useAddGiftCardMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Gift Card...");

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
      console.error("Error creating Gift Card:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Gift Card">
      <CustomForm onSubmit={onSubmit}>
        <GiftCardForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default GiftCardCreate;
