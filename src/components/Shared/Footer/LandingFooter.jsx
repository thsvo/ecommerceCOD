"use client";

import Image from "next/image";
import payment from "@/assets/images/Payment.png";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Link from "next/link";
import ContactInfo from "./ContactInfo";
import { footerData } from "@/assets/data/footerData";
import { useState } from "react";
import { useAddNewsletterMutation } from "@/redux/services/newsletter/newsletterApi";
import { toast } from "sonner";
import { Button, Form, Input } from "antd";
import { LuSend } from "react-icons/lu";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const LandingFooter = () => {
  const [email, setEmail] = useState("");
  const [addNewsletter, { isLoading }] = useAddNewsletterMutation();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const onSubmit = async () => {
    const toastId = toast.loading("Adding to newsletter...");
    const submittedData = {
      email: email,
    };

    try {
      const res = await addNewsletter(submittedData);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setEmail("");
      }
    } catch (error) {
      console.error("Error creating Attribute:", error);
    }
  };
  return (
    <section className="bg-white border-t mt-10 mb-16 lg:mb-0">
      <footer className="my-container py-10">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 items-start justify-center">
          <ContactInfo globalData={globalData} />
          <div className="flex flex-col lg:flex-row justify-between items-start lg:gap-10 lg:col-span-3">
            {footerData?.map((item, i) => (
              <div key={i} className="mt-10 lg:mt-0">
                <h3 className="text-2xl font-bold mb-6">{item?.title}</h3>
                <ul>
                  {item?.links?.map((item, i) => (
                    <Link key={i} href={item?.to}>
                      <p className="mt-2 hover:underline hover:text-primary duration-300">
                        {item?.name}
                      </p>
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
            <div className="lg:w-2/6 mt-10 lg:mt-0">
              <h3 className="text-2xl font-bold mb-6">Subscribe</h3>
              <Form
                onFinish={onSubmit}
                className="flex flex-col items-center w-full relative"
              >
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  size="large"
                  value={email}
                  className="rounded-full px-10"
                  required
                />
                <LuSend className="text-xl absolute top-3 left-3" />
                <Button
                  loading={isLoading}
                  htmlType="submit"
                  type="primary"
                  className="rounded-full font-bold lg:px-10 mt-2 w-full mx-auto"
                >
                  Subscribe
                </Button>
              </Form>
              <p className="mt-4 text-textColor font-medium text-sm">
                Subscribe to our Newsletter to receive early discount offers,
                latest news, sales and promo information.
              </p>
            </div>
          </div>
        </div>
        <hr className="my-10" />
        <div className="flex flex-col md:flex-row gap-5 lg:gap-0 justify-between items-center">
          <p className="font-semibold text-textColor">
            ©{new Date().getFullYear()}, All rights reserved
          </p>
          <Image src={payment} alt="payment" width height />
          <div className="flex items-center gap-4">
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
            >
              <FaFacebook className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
            >
              <FaLinkedin className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
            >
              <FaInstagram className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
            >
              <FaSquareXTwitter className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default LandingFooter;
