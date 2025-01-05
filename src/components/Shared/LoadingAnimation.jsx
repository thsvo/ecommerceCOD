"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import logo from "@/assets/images/logo-white.png";

const LoadingAnimation = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <>
      <Image
        src={globalData?.results?.logo ?? logo}
        alt="logo"
        height={200}
        width={200}
        className="animate-pulse"
      />
    </>
  );
};

export default LoadingAnimation;
