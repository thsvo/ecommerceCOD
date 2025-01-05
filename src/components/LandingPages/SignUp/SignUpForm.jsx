"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { useSignUpMutation } from "@/redux/services/auth/authApi";
import { Checkbox, Form } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUpForm = () => {
  const router = useRouter();

  const [signUp, { isLoading }] = useSignUpMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Signing Up...");
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match", {
        id: toastId,
      });
      return;
    }
    try {
      const res = await signUp(values).unwrap();
      if (res.success) {
        toast.success("Signed Up Successfully!", {
          id: toastId,
        });
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error(error.data.errorMessage, {
        id: toastId,
      });
    }
  };

  return (
    <div className="lg:w-[450px]">
      <CustomForm onSubmit={onSubmit}>
        <div className="mt-4 mb-6">
          <CustomInput label={"Name"} name={"name"} type={"text"} />
          <CustomInput
            label={"Phone Number"}
            name={"number"}
            type={"number"}
            required={true}
          />
          <CustomInput
            label={"Password"}
            name={"password"}
            type={"password"}
            required={true}
          />
          <CustomInput
            label={"Confirm Password"}
            name={"confirmPassword"}
            type={"password"}
            required={true}
          />
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              { required: true, message: `Please Agree to the Terms & Policy` },
            ]}
          >
            <Checkbox>I agree to the terms & policy</Checkbox>
          </Form.Item>
        </div>
        <SubmitButton text={"Sign Up"} loading={isLoading} fullWidth />
      </CustomForm>
      <div className="flex items-center my-6">
        <div className="border w-full h-0"></div>
        <span className="font-bold">Or</span>
        <div className="border w-full h-0"></div>
      </div>
      <div className="text-center">
        <span>Already have an account?</span>
        <Link href={"/sign-in"} className="font-bold text-primary text-lg">
          {" "}
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
