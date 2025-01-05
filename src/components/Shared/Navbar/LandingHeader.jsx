"use client";

import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { AutoComplete, Avatar, Button, Drawer, Popover, Tooltip } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingTopHeader from "./LandingTopHeader";
import { GiCancel } from "react-icons/gi";
import { FaSquareXTwitter } from "react-icons/fa6";
import CategoryNavigation from "./CategoryNavigation";
import BottomNavigation from "./BottomNavigation";
import Image from "next/image";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaFacebook, FaInstagram, FaLinkedin, FaSearch } from "react-icons/fa";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";

const LandingHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const { data: products } = useGetAllProductsQuery();

  const [options, setOptions] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const links = {
    Dashboard: `/${data?.role}/dashboard`,
    Order: `/${data?.role}/orders/order`,
    Profile: `/${data?.role}/account-setting`,
    Wishlist: `/${data?.role}/orders/wishlist`,
    Cart: `/${data?.role}/orders/cart`,
  };

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-start gap-4 text-md">
          {["Dashboard", "Order", "Profile", "Wishlist", "Cart"].map(
            (item, index) => (
              <Link
                key={index}
                href={links[item]}
                className={`gap-2 font-bold duration-300 ${
                  pathname === links[item]
                    ? "text-primary hover:text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full font-bold`}
          size="large"
          type="primary"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 600);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const top = (
    <div className="bg-white hidden md:block">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-5 py-2">
        <Link href={"/"}>Hotline: {globalData?.results?.businessWhatsapp}</Link>
        <div className="flex items-center gap-1 lg:gap-4">
          {!user && (
            <>
              <Link
                href={"/sign-in"}
                className="hover:underline hover:text-primary duration-300"
              >
                Sign In
              </Link>
              <div>|</div>
            </>
          )}
          <Link
            href={"/contact"}
            className="hover:underline hover:text-primary duration-300"
          >
            Contact Us
          </Link>
          <div>|</div>
          <div className="flex items-center gap-4">
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
            >
              <FaFacebook className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
            >
              <FaLinkedin className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
            >
              <FaInstagram className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
            >
              <FaSquareXTwitter className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    const filteredOptions = products?.results?.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.name?.toLowerCase().includes(value.toLowerCase())
    );

    setOptions(
      filteredOptions?.map((product) => ({
        value: product.name,
        label: (
          <Link
            href={`/products/${product?.slug}`}
            className="flex items-center gap-4 hover:text-primary pb-2 border-b border-b-gray-300"
          >
            <Image
              src={formatImagePath(product?.mainImage)}
              alt="product"
              width={30}
              height={30}
              className="object-cover"
            />
            <div className="ml-2">
              <p className="text-lg font-medium">{product?.name}</p>
              <p>
                Price: $
                {product?.offerPrice
                  ? product?.offerPrice
                  : product?.sellingPrice}
              </p>
              <p>Category: {product?.category?.name}</p>
            </div>
          </Link>
        ),
      })) || []
    );
  };

  return (
    <header>
      <nav className="lg:-mb-[1px] -mt-2 lg:mt-0">
        {isMobile ? (
          <>
            {top}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  type="primary"
                  icon={<MenuOutlined />}
                  onClick={showDrawer}
                  style={{ margin: 16 }}
                />
              </div>
              <Link href={"/"}>
                <Image
                  src={globalData?.results?.logo}
                  priority
                  alt="logo"
                  width={100}
                  height={100}
                />
              </Link>
              <div className="md:flex items-center gap-4 ">
                {user?._id ? (
                  <>
                    {" "}
                    <div className="flex items-center gap-2">
                      <Popover
                        placement="bottomRight"
                        content={content}
                        className="cursor-pointer flex items-center gap-1"
                      >
                        {data?.profile_image ? (
                          <Image
                            src={data?.profile_image}
                            alt="profile"
                            height={40}
                            width={40}
                            className="rounded-full w-[40px] h-[40px] border-2 border-primary"
                          />
                        ) : (
                          <Avatar
                            className=""
                            size={40}
                            icon={<UserOutlined />}
                          />
                        )}
                        <Tooltip placement="top" title={data?.name || "User"}>
                          <h2 className="font-semibold">
                            {data?.name
                              ? data.name.length > 6
                                ? data.name.slice(0, 6).concat("...")
                                : data.name
                              : "User"}
                          </h2>
                        </Tooltip>
                        <IoMdArrowDropdown />
                      </Popover>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/sign-in"}
                      className="flex items-center gap-2 text-primary"
                    >
                      <Button type="primary" className="font-bold mr-2">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <Drawer
                title="Menu"
                placement="left"
                onClose={onClose}
                open={drawerVisible}
              >
                <div className="flex items-center justify-between gap-4 -mt-5 mb-5">
                  <Link href={"/"}>
                    <Image
                      src={globalData?.results?.logo}
                      alt="logo"
                      width={80}
                      height={80}
                    />
                  </Link>
                  <button
                    className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                    onClick={onClose}
                  >
                    <GiCancel className="text-xl text-gray-700" />
                  </button>
                </div>
                <div className="relative mb-8">
                  <AutoComplete
                    options={options}
                    onSearch={handleSearch}
                    placeholder="Search for Products..."
                    size="large"
                    className="w-full"
                  />
                  <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-xl" />
                </div>

                <CategoryNavigation onClose={onClose} />
              </Drawer>
              <BottomNavigation />
            </div>
          </>
        ) : (
          <div>
            {top}
            <LandingTopHeader />
            <CategoryNavigation />
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;
