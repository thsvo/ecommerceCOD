import {
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CheckoutDetails from "../Cart/CheckoutDetails";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CheckoutInfo from "../Cart/CheckoutInfo";

const SingleProductCart = ({ item, count, productId, productName }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const [addOrder] = useAddOrderMutation();
  const [signUp] = useSignUpMutation();
  const [login] = useLoginMutation();

  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [code, setCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("insideDhaka");
  const [discount, setDiscount] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    setSubTotal(item?.offerPrice ?? item?.sellingPrice * count);
  }, [item, count]);

  const onSubmit = async (values) => {
    if (item?.isVariant && item.variants) {
      toast.info("Please select a variant");
      return;
    }

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
            toast.error("Number already exists");
          }
        }
      }

      setTimeout(async () => {
        try {
          const submittedData = {
            ...values,
            user: signUpResponse?.data?._id ?? user?._id,
            deviceId,
            products: [
              {
                product: productId,
                productName:
                  productName +
                  (item?.attributeCombination?.length > 0
                    ? `(${item?.attributeCombination
                        ?.map((combination) => combination?.name)
                        .join(" ")})`
                    : ""),
                quantity: count,
                sku: item?.sku,
              },
            ],
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

          try {
            const res = await addOrder(data);

            if (res?.error) {
              toast.error(res?.error?.data?.errorMessage, { id: toastId });
            } else if (res?.data?.success) {
              if (res?.data?.data?.gatewayUrl) {
                window.location.href = res?.data?.data?.gatewayUrl;
              }
              toast.success(res.data.message, { id: toastId });
              router.push("/success");
            }
          } catch (error) {
            toast.error("Something went wrong while creating Order!", {
              id: toastId,
            });
            console.error("Error creating Order:", error);
          }
        } catch (error) {
          toast.error("Something went wrong while creating Order!", {
            id: toastId,
          });
          console.error("Error preparing Order data:", error);
        }
      }, 2000);
    } catch (error) {
      toast.error("Error in order creation process!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="w-full">
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
      <div className="border-2 border-primary rounded-lg p-5 w-full">
        <CustomForm onSubmit={onSubmit}>
          <CheckoutInfo />
        </CustomForm>
      </div>
    </div>
  );
};

export default SingleProductCart;
