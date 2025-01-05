import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddOfferMutation } from "@/redux/services/offer/offerApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { toast } from "sonner";
import OfferForm from "./OfferForm";
import dayjs from "dayjs";

const OfferCreate = ({ open, setOpen }) => {
  const [addOffer, { isLoading }] = useAddOfferMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Offer...");

    try {
      let submittedData = {
        ...values,
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addOffer(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong while creating offer!", {
        id: toastId,
      });
      console.error("Error creating Offer:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Offer">
      <CustomForm onSubmit={onSubmit}>
        <OfferForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default OfferCreate;
