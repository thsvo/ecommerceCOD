"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteWishlistMutation,
  useGetSingleWishlistByUserQuery,
} from "@/redux/services/wishlist/wishlistApi";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import deleteImage from "@/assets/images/Trash-can.png";
import Image from "next/image";
import { useState } from "react";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { Button } from "antd";
import { useGetSingleProductQuery } from "@/redux/services/product/productApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import LinkButton from "@/components/Shared/LinkButton";

const Wishlist = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const { data: wishlistData, isError } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );
  const [deleteWishlist] = useDeleteWishlistMutation();

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const [productId, setProductId] = useState(null);
  const [wishlistId, setWishlistId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (id, wishlistId) => {
    setProductId(id);
    setWishlistId(wishlistId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const { data: productData } = useGetSingleProductQuery(productId, {
    skip: !productId,
  });

  const handleDelete = (itemId) => {
    deleteWishlist(itemId);
  };

  return (
    <section className="container mx-auto px-5 lg:py-10">
      <h2 className="font-normal text-2xl">My Wishlist</h2>
      <div>
        {wishlistData?.length === 0 || !wishlistData || isError ? (
          <div className="flex items-center justify-center my-10 bg-white p-10 rounded-xl shadow-xl">
            <h2 className="lg:text-2xl font-bold text-black/80  text-center text-xl">
              Please add a product to wishlist to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {wishlistData?.length} Items
            </h2>
            <div className="mt-10">
              {wishlistData?.map((item) => (
                <div
                  key={item?._id}
                  className="flex flex-col lg:flex-row items-center gap-4 justify-center mb-10 max-w-6xl mx-auto border-2 p-5 border-primary rounded-xl"
                >
                  <div className="flex flex-[2] items-center gap-4">
                    <Image
                      src={
                        formatImagePath(item?.product?.mainImage) ||
                        "placeholder.jpg"
                      }
                      alt={item?.product?.name || "Product Image"}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-xl border-2 border-primary"
                    />
                    <LinkButton
                      href={`/products/${item?.product?.slug}`}
                      className="text-xl font-normal hover:underline"
                    >
                      {item?.product?.name}
                    </LinkButton>
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.product?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.product?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.product?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        {globalData?.results?.currency +
                          " " +
                          item?.product?.sellingPrice}
                      </p>
                    )}
                  </div>
                  <div
                    onClick={() => handleDelete(item?._id)}
                    className="flex-1 "
                  >
                    <Image
                      height={20}
                      width={20}
                      src={deleteImage}
                      alt="delete image"
                      className="w-8 h-8 mx-auto hover:cursor-pointer hover:scale-110 duration-500"
                    />
                  </div>

                  <Button
                    htmlType="submit"
                    size="large"
                    type="primary"
                    icon={<FaCartShopping />}
                    onClick={() => showModal(item?.product?._id, item?._id)}
                    className={`bg-primary hover:bg-secondary font-bold px-10 `}
                  >
                    Add To Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <QuickProductView
        item={productData}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        isWishlist={true}
        wishlistId={wishlistId}
      />
    </section>
  );
};

export default Wishlist;
