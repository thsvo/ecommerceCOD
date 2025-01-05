import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import { compressImage } from "@/utilities/lib/compressImage";
import { useAddSliderMutation } from "@/redux/services/slider/sliderApi";
import SliderForm from "./SliderForm.jsx";

const SliderCreate = ({ open, setOpen }) => {
  const [addSlider, { isLoading }] = useAddSliderMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Slider...");

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
      const res = await addSlider(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Slider:", error);
      toast.error("Error creating Slider", { id: toastId });
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Slider">
      <CustomForm onSubmit={onSubmit}>
        <SliderForm />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default SliderCreate;
