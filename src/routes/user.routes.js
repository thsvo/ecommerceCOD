import { BsFillCartCheckFill, BsFillCartFill } from "react-icons/bs";
import { FaCartFlatbed, FaCartPlus } from "react-icons/fa6";
import { MdOutlineReviews } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export const userSidebarRoutes = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: TbLayoutDashboardFilled,
  },
  {
    name: "Orders",
    icon: BsFillCartFill,
    children: [
      {
        name: "Order",
        path: "orders/order",
        icon: FaCartPlus,
      },
      {
        name: "Wishlist",
        path: "orders/wishlist",
        icon: FaCartFlatbed,
      },
      { name: "Cart", path: "orders/cart", icon: BsFillCartCheckFill },
    ],
  },
  {
    name: "Reviews",
    path: "review",
    icon: MdOutlineReviews,
  },
  {
    name: "Account Setting",
    path: "account-setting",
    icon: RiUserSettingsFill,
  },
];
