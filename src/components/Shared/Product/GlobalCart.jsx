"use client";

import { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
  useUpdateCartMutation,
} from "@/redux/services/cart/cartApi";
import deleteImage from "@/assets/images/Trash-can.png";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { toast } from "sonner";

const GlobalCart = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const user = useSelector((state) => state.auth.user);
  const deviceId = useSelector((state) => state?.device?.deviceId);
  const { data: cartData, isError } = useGetSingleCartByUserQuery(
    user?._id ?? deviceId
  );
  const [deleteCart] = useDeleteCartMutation();
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    if (cartData) {
      const localCart = cartData.map((item) => ({
        ...item,
        localQuantity: item.quantity || 1,
      }));
      setCartItems(localCart);
      updateSubtotal(localCart);
    }
  }, [cartData]);

  const updateSubtotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.localQuantity,
      0
    );
    setSubTotal(total);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, localQuantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    updateSubtotal(updatedCart);

    try {
      const updatedData = {
        id,
        data: {
          quantity: newQuantity,
        },
      };
      await updateCart(updatedData).unwrap();
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };
  const handleDelete = (itemId) => {
    deleteCart(itemId);
    toast.success("Product removed from cart");
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleRouting = () => {
    router.push("/cart");
    setIsCartOpen(false);
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}

      <div className="fixed bottom-[14%] lg:bottom-[17%] right-1 z-50">
        <div
          onClick={toggleCart}
          className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center text-xl cursor-pointer"
        >
          {cartData?.length > 0 && !isError ? (
            <span className="relative">
              <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartData?.length}
              </span>
              <FaCartPlus />
            </span>
          ) : (
            <FaCartPlus />
          )}
        </div>

        {isCartOpen && (
          <div className="absolute bottom-16 lg:-bottom-0 right-0 lg:right-20 w-[370px] p-4 bg-white shadow-lg rounded-lg text-black z-50">
            <div className="flex justify-between mb-5">
              <h3 className="font-bold text-lg">Cart Details</h3>
              <button
                className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                onClick={toggleCart}
              >
                <RxCross1 className="text-xl text-gray-700" />
              </button>
            </div>
            <div>
              {cartItems.length === 0 || isError ? (
                <div className="flex items-center justify-center">
                  <h2 className="text-base text-center my-20 font-bold text-black/80">
                    Please add a product to cart to see them here
                  </h2>
                </div>
              ) : (
                <div>
                  <h2 className="font-normal text-xl mt-6 mb-8">
                    {cartItems.length} Items
                  </h2>
                  <div className="border-2 border-primary rounded p-2 max-h-[320px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 mt-4"
                      >
                        <div className="flex-1">
                          <Link href={`/products/${item?.slug}`}>
                            <Tooltip title={item.productName}>
                              <h2 className="text-sm font-semibold">
                                {item.productName.length > 40
                                  ? `${item.productName.slice(0, 40)}...`
                                  : item.productName}{" "}
                                {item?.variant &&
                                  ` (${item?.variant?.attributeCombination
                                    ?.map((combination) => combination?.name)
                                    .join(" ")})`}
                              </h2>
                            </Tooltip>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <label htmlFor={`quantity-${item._id}`}>
                              Quantity:
                            </label>
                            <div className="flex items-center border rounded w-fit">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    item.localQuantity - 1
                                  )
                                }
                                className="px-2 py-1 bg-gray-200 text-sm font-bold"
                                disabled={item.localQuantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4 text-center">
                                {item.localQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    item.localQuantity + 1
                                  )
                                }
                                className="px-2 py-1 bg-gray-200 text-sm font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-primary flex flex-1 text-base font-bold">
                          {globalData?.results?.currency +
                            " " +
                            item.price * item.localQuantity}
                        </p>
                        <Image
                          height={20}
                          width={20}
                          src={deleteImage}
                          alt="delete"
                          className="cursor-pointer hover:scale-110 transition"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    ))}
                    <hr className="border-primary mt-4" />
                    <div className="text-center ml-10 font-bold text-primary mt-2">
                      Subtotal: {globalData?.results?.currency + " " + subTotal}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              className="mt-4 w-full py-2 bg-primary text-white rounded-md font-bold"
              onClick={handleRouting}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalCart;
