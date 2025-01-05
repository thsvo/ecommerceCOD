import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { useGetAllAttributeOptionsQuery } from "@/redux/services/attributeOption/attributeOptionApi";

const AttributeForm = () => {
  const { data: attributeOptionData, isFetching: isAttributeOptionFetching } =
    useGetAllAttributeOptionsQuery();

  const categoryOptions = attributeOptionData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />

      <CustomSelect
        label={"Attribute Options"}
        name={"options"}
        options={categoryOptions}
        mode={"multiple"}
        loading={isAttributeOptionFetching}
        disabled={isAttributeOptionFetching}
      />
    </>
  );
};

export default AttributeForm;
