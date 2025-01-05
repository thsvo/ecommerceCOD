import {
  FaHome,
  FaPercentage,
  FaInfoCircle,
  FaHeadphones,
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";

export const navRoutes = [
  { name: "Home", path: "/", icon: FaHome },
  { name: "Promotions", path: "/promotions", icon: FaPercentage },
  { name: "About Us", path: "/about-us", icon: FaInfoCircle },
  { name: "Contact Us", path: "/contact-us", icon: FaHeadphones },
  {
    name: "Help & Support",
    path: "/help",
    icon: FaShop,
    children: [
      { name: "Help1", path: "/help1", icon: FaShop },
      { name: "Help2", path: "/help2", icon: FaShop },
    ],
  },
];
