"use client";

import LoginSvg from "@/assets/images/svg/LoginSvg";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const LoginImage = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <div className="hidden md:block">
      <LoginSvg primaryColor={globalData?.results?.primaryColor} />
    </div>
  );
};

export default LoginImage;
