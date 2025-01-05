import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleOfferQuery,
  useUpdateOfferMutation,
} from "@/redux/services/offer/offerApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OfferForm from "./OfferForm";
import dayjs from "dayjs";

const OfferEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: offerData, isFetching: isBrandFetching } =
    useGetSingleOfferQuery(itemId, {
      skip: !itemId,
    });

  const [updateOffer, { isLoading }] = useUpdateOfferMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Offer...");
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

      const updatedOfferData = new FormData();
      appendToFormData(submittedData, updatedOfferData);

      const updatedData = {
        id: itemId,
        data: updatedOfferData,
      };

      const res = await updateOffer(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Offer:", error);
      toast.error("An error occurred while updating the Offer.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(offerData, [
        {
          name: "startDate",
          value: dayjs(offerData?.startDate).format("YYYY-MM-DD"),
          errors: "",
        },
        {
          name: "endDate",
          value: dayjs(offerData?.endDate).format("YYYY-MM-DD"),
          errors: "",
        },
        {
          name: "product",
          value: offerData?.product?.map((item) => item?.name),
          errors: "",
        },
      ])
    );
  }, [offerData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Offer"
      placement={"left"}
      loading={isBrandFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <OfferForm attachment={offerData?.attachment} />

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

export default OfferEdit;
