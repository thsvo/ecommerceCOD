import LoginButton from "@/components/LandingPages/Success/LoginButton";
import SuccessAnimation from "@/components/LandingPages/Success/SuccessAnimation";
import { Button } from "antd";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] lg:h-[80vh] text-center">
      <SuccessAnimation />
      <h1 className="text-xl font-semibold">
        Your order was a success. It is being processed right now.
      </h1>
      <Link href={"/products"} className="mt-10">
        <Button type="primary" className="py-5 px-10 rounded font-bold">
          Continue Shopping
        </Button>
      </Link>
      <LoginButton />
    </div>
  );
};

export default page;
