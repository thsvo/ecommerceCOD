"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { Button } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
const LoginButton = () => {
  const user = useSelector(useCurrentUser);
  return (
    <>
      {!user && (
        <Link href={"/sign-in"} className="mt-5">
          <Button type="dashed" className="py-5 px-10 rounded font-bold">
            Login
          </Button>
        </Link>
      )}
    </>
  );
};

export default LoginButton;
