import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddAttributeOptionMutation } from "@/redux/services/attributeOption/attributeOptionApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import AttributeOptionForm from "./AttributeOptionForm";
import { compressImage } from "@/utilities/lib/compressImage";

const AttributeOptionCreate = ({ open, setOpen }) => {
  const [addAttributeOption, { isLoading }] = useAddAttributeOptionMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Attribute Option...");

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
      const res = await addAttributeOption(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Attribute Option:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Attribute Option">
      <CustomForm onSubmit={onSubmit}>
        <AttributeOptionForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default AttributeOptionCreate;
