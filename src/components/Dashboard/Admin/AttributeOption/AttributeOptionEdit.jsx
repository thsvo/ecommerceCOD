"use client";

import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleAttributeOptionQuery,
  useUpdateAttributeOptionMutation,
} from "@/redux/services/attributeOption/attributeOptionApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AttributeOptionForm from "./AttributeOptionForm";
import { compressImage } from "@/utilities/lib/compressImage";

const AttributeOptionEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: attributeOptionData, isFetching: isAttributeOptionFetching } =
    useGetSingleAttributeOptionQuery(itemId, {
      skip: !itemId,
    });

  const [updateAttributeOption, { isLoading }] =
    useUpdateAttributeOptionMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Attribute Option...");
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

      const res = await updateAttributeOption(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Attribute Option:", error);
      toast.error("An error occurred while updating the Attribute Option.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(attributeOptionData, []));
  }, [attributeOptionData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Attribute Option"
      placement={"left"}
      loading={isAttributeOptionFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <AttributeOptionForm attachment={attributeOptionData?.attachment} />

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

export default AttributeOptionEdit;
