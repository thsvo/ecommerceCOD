import Image from "next/image";
import Link from "next/link";
import { Avatar, Button, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { toast } from "sonner";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import logo from "@/assets/images/logo-white.png";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data } = useGetSingleUserQuery(user?._id);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!", { duration: 2000 });
  };

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-center gap-4 text-lg">
          {data?.profile_image ? (
            <Image
              src={data?.profile_image}
              alt="profile"
              height={40}
              width={40}
              className="rounded-full w-[60px] h-[60px] border-2 !border-primary"
            />
          ) : (
            <Avatar size={40} icon={<UserOutlined />} />
          )}
          <div className="flex flex-col text-center font-normal">
            <div className="text-xl font-bold">
              <span className="mr-1">{data?.name ?? ""}</span>
            </div>
            <span className={`text-base`}>{data?.email}</span>
          </div>
        </div>
      </div>

      <Link
        href={`/${data?.role}/account-setting`}
        className="flex justify-center font-semibold hover:text-primary border rounded-xl py-2"
      >
        Account Setting
      </Link>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full`}
          size="large"
          type="default"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
  return (
    <div className="flex justify-between items-center mt-2 pb-2">
      <div className="flex items-center -ml-10 lg:-ml-6">
        <Link href={"/"}>
          <Image
            src={globalData?.results?.logo ?? logo}
            alt="logo"
            height={40}
            width={40}
            className="w-full h-full"
          />
        </Link>
      </div>
      <Popover
        placement="bottomLeft"
        content={content}
        className="lg:mr-4 cursor-pointer bg-primary"
      >
        {data?.profile_image ? (
          <Image
            src={data?.profile_image}
            alt="profile"
            height={40}
            width={40}
            className="rounded-full w-[40px] h-[40px]"
          />
        ) : (
          <Avatar
            className="!-mr-6 lg:mr-0"
            size={40}
            icon={<UserOutlined />}
          />
        )}
      </Popover>
    </div>
  );
};

export default Profile;
