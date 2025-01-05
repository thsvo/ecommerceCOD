import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddCategoryMutation } from "@/redux/services/category/categoryApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import CategoryForm from "./CategoryForm";
import { compressImage } from "@/utilities/lib/compressImage";

const CategoryCreate = ({ open, setOpen }) => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Category...");

    try {
      const submittedData = {
        ...values,
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addCategory(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Category:", error);
      toast.error("Error creating Category", { id: toastId });
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Category">
      <CustomForm onSubmit={onSubmit}>
        <CategoryForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default CategoryCreate;
