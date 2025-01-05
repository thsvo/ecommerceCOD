import { Button } from "antd";
import { SubmitButton } from "../Reusable/Button/CustomButton";

const FormButton = ({ setOpen, loading }) => {
  return (
    <div className="flex justify-end items-center gap-6 mt-10">
      <Button
        onClick={() => setOpen(false)}
        type="default"
        className="!font-bold bg-transparent !text-red-500 px-10 pt-4 pb-4 border !border-red-500"
      >
        Cancel
      </Button>
      <SubmitButton loading={loading} text={"Save"} />
    </div>
  );
};

export default FormButton;
