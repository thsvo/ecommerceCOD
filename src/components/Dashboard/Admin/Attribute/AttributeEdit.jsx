"use client";

import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleAttributeQuery,
  useUpdateAttributeMutation,
} from "@/redux/services/attribute/attributeApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AttributeForm from "./AttributeForm";

const AttributeEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: attributeData, isFetching: isAttributeFetching } =
    useGetSingleAttributeQuery(itemId, {
      skip: !itemId,
    });

  const [updateAttribute, { isLoading }] = useUpdateAttributeMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Attribute...");
    try {
      const submittedData = {
        ...values,
      };

      const updatedCategoryData = new FormData();
      appendToFormData(submittedData, updatedCategoryData);

      const updatedData = {
        id: itemId,
        data: updatedCategoryData,
      };

      const res = await updateAttribute(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Attribute:", error);
      toast.error("An error occurred while updating the Attribute.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(attributeData, [
        {
          name: "options",
          value: attributeData?.options?.map((item) => item?._id),
          errors: "",
        },
      ])
    );
  }, [attributeData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Attribute"
      placement={"left"}
      loading={isAttributeFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <AttributeForm />

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

export default AttributeEdit;
