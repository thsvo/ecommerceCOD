import { Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { TbListDetails, TbHeart } from "react-icons/tb";

const ProductHover = ({ item }) => {
  return (
    <div className="flex items-center gap-4 bg-white/60 px-6 py-4 rounded-xl">
      <Tooltip placement="top" title={"Details"}>
        <Link
          href={`/products/${item?.slug}`}
          className="text-2xl cursor-pointer hover:scale-110 duration-300 hover:text-primary"
        >
          <TbListDetails />
        </Link>
      </Tooltip>

      <span className="border h-6 border-textColor"></span>
      <Tooltip placement="top" title={"Add to Wishlist"}>
        <div className="text-2xl cursor-pointer hover:scale-110 duration-300 hover:text-danger">
          <TbHeart />
        </div>
      </Tooltip>
    </div>
  );
};

export default ProductHover;
