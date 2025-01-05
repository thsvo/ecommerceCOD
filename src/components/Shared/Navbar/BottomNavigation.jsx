"use client";

import Link from "next/link";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { FaCodeCompare } from "react-icons/fa6";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";

const BottomNavigation = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);

  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );
  const { data: wishListData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );
  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);

  const navItems = [
    {
      name: "Product",
      href: "/products",
      icon: <AppstoreOutlined />,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: (
        <div className="relative">
          <HeartOutlined />
          {wishListData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {wishListData.length}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Compare",
      href: "/compare",
      icon: (
        <div className="relative">
          <FaCodeCompare className="rotate-90 mt-1 mb-1" />
          {compareData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {compareData.length}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Checkout",
      href: "/cart",
      icon: (
        <div className="relative">
          <ShoppingCartOutlined />
          {cartData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartData.length}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (data?.role) {
    navItems.push({
      name: "Dashboard",
      href: `/${data.role}/dashboard`,
      icon: <TbLayoutDashboardFilled className="mt-1 mb-1" />,
    });
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-300 shadow-md lg:hidden">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-gray-600 hover:text-primary transition relative"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
