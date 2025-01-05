"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { useEffect } from "react";
import { TbBrandAirtable } from "react-icons/tb";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const user = useSelector(useCurrentUser);

  const { data: dashboardData } = useGetSingleUserDashboardQuery(user?._id);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          icon={TbBrandAirtable}
          title="Wishlists"
          data={dashboardData?.wishlists}
          href={"/user/orders/wishlist"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Carts"
          data={dashboardData?.carts}
          href={"/user/orders/carts"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.orders}
          href={"/user/orders/order"}
        />
      </div>
    </>
  );
};

export default UserDashboard;
