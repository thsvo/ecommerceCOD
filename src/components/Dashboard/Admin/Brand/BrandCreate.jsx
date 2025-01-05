import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddBrandMutation } from "@/redux/services/brand/brandApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import BrandForm from "./BrandForm";
import { compressImage } from "@/utilities/lib/compressImage";

const BrandCreate = ({ open, setOpen }) => {
  const [addBrand, { isLoading }] = useAddBrandMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Brand...");

    try {
      let submittedData = {
        ...values,
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addBrand(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Brand:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Brand">
      <CustomForm onSubmit={onSubmit}>
        <BrandForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default BrandCreate;
