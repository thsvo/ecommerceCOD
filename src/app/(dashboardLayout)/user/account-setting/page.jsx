"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import ProfileUploader from "@/components/Reusable/Form/ProfileUploader";
import {
  useChangePasswordMutation,
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { Button, Divider, Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserAccountSetting = () => {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangePasswordLoading }] =
    useChangePasswordMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating User Information...");
    try {
      const submittedData = {
        ...values,
      };

      if (!values.profile_image[0].url) {
        submittedData.profile_image = await compressImage(
          values.profile_image[0].originFileObj
        );
      }
      const updatedUserData = new FormData();
      appendToFormData(submittedData, updatedUserData);

      const updatedData = {
        id: user?._id,
        data: updatedUserData,
      };

      const res = await updateUser(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user .", {
        id: toastId,
      });
    }
  };

  const handlePasswordUpdate = async (values) => {
    const toastId = toast.loading("Changing Password...");
    let res;
    try {
      const submittedData = {
        ...values,
      };

      const updatedData = {
        id: user?._id,
        data: submittedData,
      };

      res = await changePassword(updatedData);

      if (res.error) {
        toast.error(res.error.data.errorMessage, { id: toastId });
      }

      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating changing password:", error);
      toast.error("An error occurred while changing password.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(data));
  }, [data]);

  return (
    <section className="w-3/6 mx-auto">
      <CustomForm fields={fields} onSubmit={onSubmit}>
        <Divider orientation="left" orientationMargin={0}>
          Account Settings
        </Divider>
        <div className=" flex flex-col justify-center items-center">
          <ProfileUploader
            defaultValue={data?.profile_image}
            name={"profile_image"}
            label={"Profile Image"}
          />
        </div>

        <div className="flex justify-end">
          <Button htmlType="button" onClick={() => setOpen(true)}>
            Change Password
          </Button>
        </div>
        <CustomInput name={"name"} label={"Name"} />
        <CustomInput name={"number"} label={"Phone Number"} required={true} />
        <CustomInput name={"email"} label={"Email"} required={true} />
        <CustomInput name={"address"} label={"Address"} type={"textarea"} />

        <div className="flex justify-center my-10">
          <SubmitButton text={"Save"} loading={isLoading} fullWidth={true} />
        </div>
      </CustomForm>

      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div className="p-8">
          <CustomForm onSubmit={handlePasswordUpdate} fields={fields}>
            <CustomInput
              name={"current_password"}
              label={"Current Password"}
              type={"password"}
              required
            />
            <CustomInput
              name={"new_password"}
              label={"New Password"}
              type={"password"}
              required
            />
            <div className="lg:flex mt-10 gap-6 items-center justify-center">
              <Button
                onClick={() => setOpen(false)}
                type="text"
                className="!font-bold bg-transparent !text-red-500 px-10 py-4 border !border-red-500"
              >
                Cancel
              </Button>
              <SubmitButton
                text={"Change Password"}
                loading={isChangePasswordLoading}
              />
            </div>
          </CustomForm>
        </div>
      </Modal>
    </section>
  );
};

export default UserAccountSetting;
