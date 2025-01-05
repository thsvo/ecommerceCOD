"use client";

import { Button, Layout, Menu } from "antd";
import { useState } from "react";
import { TbArrowBadgeRight } from "react-icons/tb";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import { sidebarItemsGenerator } from "@/utilities/lib/sidebarItemsGenerator";
import { userSidebarRoutes } from "@/routes/user.routes";
import { adminSidebarRoutes } from "@/routes/admin.routes";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";

const { Sider } = Layout;

const Sidebar = () => {
  const user = useSelector(useCurrentUser);

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  let routes;

  switch (user?.role) {
    case "admin":
      routes = adminSidebarRoutes;
      break;
    case "user":
      routes = userSidebarRoutes;
      break;
  }

  const sidebarItems = sidebarItemsGenerator(routes, pathname, user?.role);

  const formattedSegment = pathname
    .split("/")
    .slice(-1)[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className="relative bg-white border-r border-gray-200 drop-shadow-primary
    "
    >
      <Sider
        className="h-screen top-0"
        theme="light"
        trigger={null}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
        onCollapse={(collapsedState) => setCollapsed(collapsedState)}
      >
        <Menu
          mode="inline"
          className="mt-5"
          items={sidebarItems}
          defaultSelectedKeys={formattedSegment}
        />
      </Sider>

      <div className="sidebar-toggle-button">
        <Button
          className="-mr-1 bg-white border border-gray-200 rounded-full text-primary"
          type="primary"
          icon={
            collapsed ? (
              <TbArrowBadgeRight className="text-2xl" />
            ) : (
              <TbArrowBadgeRight className="rotate-180 text-2xl" />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            position: "absolute",
            right: -25,
            top: -10,
            zIndex: 1000,
            padding: "10px",
            borderRadius: "9999px",
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
