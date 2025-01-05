"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { MdOutlinePhone } from "react-icons/md";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const serviceId = "service_wwqdu65";
  const templateId = "template_yu9xi1e";
  const publicKey = "zm3VN97UXp-R42W0z";

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Submitting...");

    if (!phoneRegex.test(values.number)) {
      toast.error("Please enter a valid phone number!", {
        id: toastId,
      });
      return;
    }
    setLoading(true);

    const templateParam = {
      from_name: values?.name,
      from_email: values?.email,
      from_number: values?.number,
      to_name: "Vitasoft Solutions",
      message: values?.message,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParam, publicKey);
      toast.success(`Thank you for your message ${templateParam?.from_name}`, {
        id: toastId,
      });
    } catch (err) {
      toast.error("Something went wrong! Please try again!", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CustomForm onSubmit={handleSubmit}>
      <div className="two-grid">
        <CustomInput
          label={"Name"}
          name="name"
          required={true}
          type={"text"}
          prefix={<UserOutlined />}
        />
        <CustomInput
          label={"Email"}
          name="email"
          required={true}
          type={"email"}
          prefix={<MailOutlined />}
        />
      </div>
      <CustomInput
        label={"Number"}
        name="number"
        required={true}
        prefix={<MdOutlinePhone />}
      />
      <CustomInput
        label={"Message"}
        name="message"
        required={true}
        type={"textarea"}
      />
      <SubmitButton text={"Send Message"} loading={loading} />
    </CustomForm>
  );
};

export default ContactForm;
