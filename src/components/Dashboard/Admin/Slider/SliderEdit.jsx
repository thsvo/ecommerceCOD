"use client";

import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SliderForm from "./SliderForm.jsx";
import { compressImage } from "@/utilities/lib/compressImage";
import {
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
} from "@/redux/services/slider/sliderApi";

const SliderEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: sliderData, isFetching: isCategoryFetching } =
    useGetSingleSliderQuery(itemId, {
      skip: !itemId,
    });

  const [updateSlider, { isLoading }] = useUpdateSliderMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Slider...");
    try {
      const submittedData = {
        ...values,
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

      const res = await updateSlider(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Slider:", error);
      toast.error("An error occurred while updating the Slider.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(sliderData, [
        {
          name: "category",
          value: sliderData?.category?._id,
          errors: "",
        },
      ])
    );
  }, [sliderData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Slider"
      placement={"left"}
      loading={isCategoryFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <SliderForm attachment={sliderData?.attachment} />

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

export default SliderEdit;
