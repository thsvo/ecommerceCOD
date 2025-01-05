"use client";

import SuccessSvg from "@/assets/images/svg/SuccessSvg";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const SuccessAnimation = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <div>
      <div className="hidden md:block">
        <SuccessSvg primaryColor={globalData?.results?.primaryColor} />
      </div>
      <div className="md:hidden">
        <SuccessSvg
          primaryColor={globalData?.results?.primaryColor}
          size={370}
        />
      </div>
    </div>
  );
};

export default SuccessAnimation;
