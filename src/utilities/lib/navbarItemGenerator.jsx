import React from "react";
import { Menu, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";

const navbarItemsGenerator = (items, pathName) => {
  const generateMenuItem = (item) => {
    return {
      key: item.path,
      icon: React.createElement(item.icon, { className: "" }),
      label: (
        <Link
          href={item.path}
          className={`hover:text-primary text-base font-bold ${
            pathName === item?.path ? "text-primary" : ""
          }`}
        >
          {item.name}
        </Link>
      ),
    };
  };

  const generatePopoverContent = (children) => (
    <Menu
      items={children.map((child) => generateMenuItem(child))}
      style={{ border: "0px" }}
    />
  );

  return items.map((item) => {
    if (item.children) {
      return {
        key: item.path,
        icon: React.createElement(item.icon, { className: "" }),
        label: (
          <Popover
            content={generatePopoverContent(item.children)}
            title={item.name}
            trigger="hover"
          >
            <Link
              href={item?.path}
              className={`hover:text-primary font-bold text-base  ${
                pathName === item?.path ? "text-primary" : ""
              }`}
            >
              {item.name} <DownOutlined />
            </Link>
          </Popover>
        ),
      };
    }
    return generateMenuItem(item);
  });
};

export default navbarItemsGenerator;
