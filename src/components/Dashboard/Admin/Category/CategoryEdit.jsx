"use client";

import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/services/category/categoryApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CategoryForm from "./CategoryForm";
import { compressImage } from "@/utilities/lib/compressImage";

const CategoryEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: categoryData, isFetching: isCategoryFetching } =
    useGetSingleCategoryQuery(itemId, {
      skip: !itemId,
    });

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Category...");
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

      const res = await updateCategory(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Category:", error);
      toast.error("An error occurred while updating the Category.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(categoryData, [
        {
          name: "categories",
          value: categoryData?.categories?.map((item) => item?.name),
          errors: "",
        },
        {
          name: "parentCategory",
          value: categoryData?.parentCategory?.name,
          errors: "",
        },
        {
          name: "subCategories",
          value: categoryData?.subCategories?.map((item) => item?.name),
          errors: "",
        },
      ])
    );
  }, [categoryData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Category"
      placement={"left"}
      loading={isCategoryFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <CategoryForm attachment={categoryData?.attachment} />

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

export default CategoryEdit;
