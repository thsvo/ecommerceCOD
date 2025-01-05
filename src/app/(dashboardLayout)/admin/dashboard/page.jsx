"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useGetAdminDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { useEffect } from "react";
import { TbBrandAirtable } from "react-icons/tb";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const { data: dashboardData } = useGetAdminDashboardQuery();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          icon={TbBrandAirtable}
          title="Brands"
          data={dashboardData?.results?.brands}
          href={"/admin/products/brand"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Categories"
          data={dashboardData?.results?.categories}
          href={"/admin/products/category"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Products"
          data={dashboardData?.results?.products}
          href={"/admin/products/product"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Coupons"
          data={dashboardData?.results?.coupons}
          href={"/admin/orders/coupon"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Gift Cards"
          data={dashboardData?.results?.giftCards}
          href={"/admin/orders/coupon"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Wishlists"
          data={dashboardData?.results?.wishlists}
          href={"/admin/orders/wishlist"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Carts"
          data={dashboardData?.results?.carts}
          href={"/admin/orders/carts"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.results?.orders}
          href={"/admin/orders/order"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Sliders"
          data={dashboardData?.results?.sliders}
          href={"/admin/slider"}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
