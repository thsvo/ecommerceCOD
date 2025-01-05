import { Rate, Tooltip } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";
import LinkButton from "@/components/Shared/LinkButton";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const [addCart] = useAddCartMutation();

  const addToCart = async () => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: item?._id,
      quantity: 1,
      sku: item?.sku,
      price: item?.offerPrice ? item?.offerPrice : item?.sellingPrice,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart.", { id: toastId });
    }
  };

  return (
    <div
      className="border rounded-xl shadow-xl relative group w-[300px] lg:w-[360px] h-[500px] md:h-[530px] lg:h-[550px] mx-auto bg-white flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-xl flex-shrink-0 lg:h-[350px]">
        {item?.video && isHovered ? (
          <video
            src={formatImagePath(item?.video)}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            autoPlay
            muted
            controls={false}
            className="w-full h-full rounded-t-xl object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={
              pathname === "/products"
                ? item?.mainImage
                : formatImagePath(item?.mainImage)
            }
            alt={item?.name}
            width={360}
            height={350}
            className="rounded-t-xl w-[300px] lg:w-[360px] h-[300px] lg:h-[350px] object-cover group-hover:scale-110 duration-500"
          />
        )}
      </div>

      <div className="bg-white flex-grow relative">
        <div className="px-3 lg:p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-2 gap-4 mt-2 lg:-mt-2">
            <Rate
              disabled
              value={item?.ratings?.average}
              allowHalf
              style={{ fontSize: "14px" }}
            />
            <QuickViewHover item={item} />
          </div>
          <LinkButton href={`/products/${item?.slug}`}>
            <Tooltip placement="top" title={item?.name}>
              <h2 className="text-[14px] md:text-base text-center lg:mt-2 mb-6">
                {item?.name.length > 50
                  ? item.name.slice(0, 50).concat("...")
                  : item.name}
              </h2>
            </Tooltip>
          </LinkButton>
          <div className="flex items-center gap-2 lg:gap-4 justify-center text-center absolute  bottom-2 md:bottom-4 left-0 right-0">
            {item?.offerPrice && (
              <p className="text-base font-bold line-through text-red-500">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            <p className="text-primary text-xl font-bold">
              {globalData?.results?.currency +
                " " +
                (item?.offerPrice || item?.sellingPrice)}
            </p>
          </div>
        </div>
      </div>

      {item?.stock ? (
        <div>
          {item?.isVariant ? (
            <LinkButton href={`/products/${item?.slug}`}>
              <div className="bg-primary py-2 text-white w-full rounded-b-xl">
                Details
              </div>
            </LinkButton>
          ) : (
            <button
              className="bg-primary text-white py-2 w-full rounded-b-xl cursor-pointer"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      ) : (
        <button
          className="bg-grey text-red-500 py-2 w-full rounded-b-xl"
          disabled
        >
          Stock Out
        </button>
      )}
    </div>
  );
};

export default ProductCard;
