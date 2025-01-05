import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleGiftCardQuery,
  useUpdateGiftCardMutation,
} from "@/redux/services/giftCard/giftCardApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GiftCardForm from "./GiftCardForm";
import { compressImage } from "@/utilities/lib/compressImage";
import dayjs from "dayjs";

const GiftCardEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: giftCardData, isFetching: isGiftCardFetching } =
    useGetSingleGiftCardQuery(itemId, {
      skip: !itemId,
    });

  const [updateGiftCard, { isLoading }] = useUpdateGiftCardMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Gift Card...");
    try {
      const submittedData = {
        ...values,
        expiredDate: dayjs(values.expiredDate).format("YYYY-MM-DD"),
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

      const res = await updateGiftCard(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Gift Card:", error);
      toast.error("An error occurred while updating the Gift Card.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(giftCardData, [
        {
          name: "user",
          value: giftCardData?.user?._id,
          errors: "",
        },
      ])
    );
  }, [giftCardData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Gift Card"
      placement={"left"}
      loading={isGiftCardFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <GiftCardForm attachment={giftCardData?.attachment} />

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

export default GiftCardEdit;
