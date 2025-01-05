"use client";

import deleteImage from "@/assets/images/Trash-can.png";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import {
  useGetSingleUserQuery,
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteBulkCartMutation,
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
} from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CheckoutDetails from "./CheckoutDetails";
import CheckoutInfo from "./CheckoutInfo";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { useRouter } from "next/navigation";

const CartDetails = () => {
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const dispatch = useDispatch();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const { data: cartData, isError } = useGetSingleCartByUserQuery(
    user?._id ?? deviceId
  );

  const [number, setNumber] = useState(null);

  const { data: userData } = useGetSingleUserQuery(number, {
    skip: !number,
  });

  const [deleteCart] = useDeleteCartMutation();
  const [deleteBulkCart] = useDeleteBulkCartMutation();

  const [addOrder] = useAddOrderMutation();
  const [signUp] = useSignUpMutation();
  const [login] = useLoginMutation();

  const [counts, setCounts] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [code, setCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("insideDhaka");
  const [discount, setDiscount] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (cartData) {
      setSubTotal(
        cartData?.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );
      setCounts(
        cartData?.reduce(
          (acc, item) => ({ ...acc, [item._id]: Number(item.quantity) || 1 }),
          {}
        )
      );
    }
  }, [cartData]);

  const handleDelete = (itemId) => {
    deleteCart(itemId);
    toast.success("Product removed from cart");
  };

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Order...");
    let signUpResponse;

    try {
      if (!user) {
        const signUpData = {
          name: values?.name,
          number: values?.number,
          password: values?.number,
        };

        try {
          signUpResponse = await signUp(signUpData).unwrap();

          const loginData = {
            emailNumber: values?.number,
            password: values?.number,
          };

          const loginResponse = await login(loginData).unwrap();
          console.log("Login successful:", loginResponse);

          if (loginResponse.success) {
            dispatch(
              setUser({
                user: loginResponse.data.user,
                token: loginResponse.data.token,
              })
            );
          }
        } catch (error) {
          if (error?.data?.errorMessage === "number already exists") {
            setNumber(values?.number);
          }
        }
      }

      const finalUserId =
        userData?._id || signUpResponse?.data?._id || user?._id;

      if (!finalUserId) {
        toast.error("Failed to retrieve user data. Please try again.", {
          id: toastId,
        });
        return;
      }

      const submittedData = {
        ...values,
        user: finalUserId,
        deviceId,
        products: cartData?.map((item) => ({
          product: item?.productId,
          productName:
            item?.productName +
            (item?.variant && item?.variant?.attributeCombination?.length > 0
              ? ` (${item?.variant?.attributeCombination
                  ?.map((combination) => combination?.name)
                  .join(" ")})`
              : ""),
          quantity: item?.quantity,
          sku: item?.sku,
        })),
        shippingFee,
        discount,
        deliveryOption,
        code,
        grandTotal,
        subTotal,
      };

      if (values.paymentType === "cod") {
        submittedData.paymentMethod = "cod";
      }

      const data = new FormData();
      appendToFormData(submittedData, data);

      console.log("Submitting order data:", submittedData);

      const res = await addOrder(data);

      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      } else if (res?.data?.success) {
        console.log("Order successfully created:", res.data);
        if (res?.data?.data?.gatewayUrl) {
          window.location.href = res?.data?.data?.gatewayUrl;
        }
        toast.success(res.data.message, { id: toastId });
        const cartIds = cartData?.map((item) => item._id);
        await deleteBulkCart(cartIds);
        router.push("/success");
      }
    } catch (error) {
      console.error("Error during order submission:", error);
      toast.error("Something went wrong while creating Order!", {
        id: toastId,
      });
    }
  };

  return (
    <section className="container mx-auto px-5 py-5 lg:py-10 relative">
      <h2 className="font-normal text-2xl">Order List</h2>
      <div>
        {cartData?.length === 0 || !cartData || isError ? (
          <div className="flex items-center justify-center bg-white shadow-xl rounded-xl p-10 my-10">
            <h2 className="lg:text-2xl font-bold text-black/80 text-center text-xl">
              Please add a product to cart to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {cartData?.length} Items
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-4 justify-between my-10">
              <div className="lg:w-3/6 border-2 border-primary rounded-lg p-5 lg:sticky top-10">
                {cartData?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex flex-col lg:flex-row items-center gap-4 justify-center pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
                  >
                    <div className="flex flex-[3] items-center gap-4">
                      <Image
                        src={formatImagePath(item?.image)}
                        alt={item?.product?.name || "Product Image"}
                        width={128}
                        height={128}
                        className="w-28 h-28 rounded-xl border-2 border-primary"
                      />
                      <div>
                        <Link
                          href={`/products/${item?.slug}`}
                          className="text-base font-normal hover:underline"
                        >
                          {item?.productName}
                          {item?.variant &&
                            ` (${item?.variant?.attributeCombination
                              ?.map((combination) => combination?.name)
                              .join(" ")})`}
                        </Link>
                        <div className="mt-2 font-semibold">
                          Quantity: {counts[item._id]}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center gap-4">
                      <p className="text-primary text-2xl font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.price * counts[item._id]}
                      </p>
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
                  </div>
                ))}
              </div>
              <div className="lg:w-4/12 w-full">
                <CheckoutDetails
                  subTotal={subTotal}
                  grandTotal={grandTotal}
                  code={code}
                  setCode={setCode}
                  setDeliveryOption={setDeliveryOption}
                  deliveryOption={deliveryOption}
                  setDiscount={setDiscount}
                  discount={discount}
                  shippingFee={shippingFee}
                  setShippingFee={setShippingFee}
                  setGrandTotal={setGrandTotal}
                />
              </div>

              <div className="lg:w-2/6 w-full border-2 border-primary rounded-lg p-5">
                <CustomForm onSubmit={onSubmit}>
                  <CheckoutInfo />
                </CustomForm>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartDetails;
