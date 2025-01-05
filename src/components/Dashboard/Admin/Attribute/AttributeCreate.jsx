import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import AttributeForm from "./AttributeForm";
import { useAddAttributeMutation } from "@/redux/services/attribute/attributeApi";

const AttributeCreate = ({ open, setOpen }) => {
  const [addAttribute, { isLoading }] = useAddAttributeMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Attribute...");

    try {
      const submittedData = {
        ...values,
      };

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addAttribute(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Attribute:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Attribute">
      <CustomForm onSubmit={onSubmit}>
        <AttributeForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default AttributeCreate;
