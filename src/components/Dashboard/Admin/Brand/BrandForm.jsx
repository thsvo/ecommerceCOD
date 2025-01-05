import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";

const BrandForm = ({ attachment }) => {
  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
      <FileUploader
        defaultValue={attachment}
        label="Brand Logo"
        name="attachment"
        required={true}
      />
    </>
  );
};

export default BrandForm;
