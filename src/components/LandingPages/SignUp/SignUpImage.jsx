"use client";

import SignUpSvg from "@/assets/images/svg/SignUpSvg";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const LoginImage = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <div className="hidden md:block">
      <SignUpSvg primaryColor={globalData?.results?.primaryColor} />
    </div>
  );
};

export default LoginImage;
