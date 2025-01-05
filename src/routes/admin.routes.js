import { AiFillProduct } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsFillCartCheckFill, BsFillCartFill } from "react-icons/bs";
import { CiGift } from "react-icons/ci";
import { FaUser, FaImage } from "react-icons/fa";
import { FaCartFlatbed, FaCartPlus } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import {
  MdAddShoppingCart,
  MdOutlineAcUnit,
  MdOutlineMergeType,
  MdOutlineReviews,
} from "react-icons/md";
import {
  RiCoupon3Line,
  RiUserSettingsFill,
  RiMessage2Fill,
} from "react-icons/ri";
import { TbBrandAirtable, TbLayoutDashboardFilled } from "react-icons/tb";

export const adminSidebarRoutes = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: TbLayoutDashboardFilled,
  },
  {
    name: "Products",
    icon: AiFillProduct,
    children: [
      {
        name: "Attribute Option",
        path: "products/attribute-option",
        icon: MdOutlineAcUnit,
      },
      {
        name: "Attribute",
        path: "products/attribute",
        icon: MdOutlineMergeType,
      },

      { name: "Brand", path: "products/brand", icon: TbBrandAirtable },
      { name: "Category", path: "products/category", icon: BiCategoryAlt },
      { name: "Product", path: "products/product", icon: MdAddShoppingCart },
    ],
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
      { name: "Gift Card", path: "orders/gift-card", icon: CiGift },
      { name: "Coupon", path: "orders/coupon", icon: RiCoupon3Line },
    ],
  },
  // {
  //   name: "Offers",
  //   path: "offer",
  //   icon: MdLocalOffer,
  // },
  {
    name: "Reviews",
    path: "review",
    icon: MdOutlineReviews,
  },
  {
    name: "Sliders",
    path: "slider",
    icon: FaImage,
  },
  {
    name: "User",
    path: "user",
    icon: FaUser,
  },
  {
    name: "Account Setting",
    path: "account-setting",
    icon: RiUserSettingsFill,
  },
  {
    name: "Global Setting",
    path: "global-setting",
    icon: IoSettingsSharp,
  },
  {
    name: "Message Platform",
    path: "message-platform",
    icon: RiMessage2Fill,
  },
];
