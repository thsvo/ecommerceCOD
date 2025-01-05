import { useState, useEffect } from "react";
import { Radio, Input, Button } from "antd";
import { useGetSingleCouponByCodeQuery } from "@/redux/services/coupon/couponAPi";
import { useGetSingleGiftCardByCodeQuery } from "@/redux/services/giftCard/giftCardApi";
import { toast } from "sonner";
import moment from "moment";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const CheckoutDetails = ({
  subTotal,
  grandTotal,
  code,
  setCode,
  discount,
  setDiscount,
  deliveryOption,
  setDeliveryOption,
  setShippingFee,
  shippingFee,
  setGrandTotal,
}) => {
  const [discountOption, setDiscountOption] = useState("coupon");

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const {
    data: couponData,
    isFetching: isCouponFetching,
    error: couponError,
  } = useGetSingleCouponByCodeQuery(code, {
    skip: !code || discountOption !== "coupon",
  });

  const {
    data: giftCardData,
    isFetching: isGiftCardFetching,
    error: giftCardError,
  } = useGetSingleGiftCardByCodeQuery(code, {
    skip: !code || discountOption !== "giftCard",
  });

  useEffect(() => {
    if (deliveryOption === "insideDhaka") {
      setShippingFee(parseInt(globalData?.results?.deliveryChargeInsideDhaka));
    } else if (deliveryOption === "outsideDhaka") {
      setShippingFee(parseInt(globalData?.results?.deliveryChargeOutsideDhaka));
    }
  }, [deliveryOption, setShippingFee, globalData]);

  const handleCode = () => {
    if (isCouponFetching || isGiftCardFetching) {
      toast.loading("Loading...");
    }

    if (couponError?.data?.errorMessage || giftCardError?.data?.errorMessage) {
      toast.error(
        couponError?.data?.errorMessage || giftCardError?.data?.errorMessage
      );
      setDiscount(null);
    } else if (
      (couponData && couponData.minimumAmount > subTotal) ||
      (giftCardData && giftCardData.minimumAmount > subTotal)
    ) {
      toast.error("Minimum amount is not met");
      setDiscount(null);
    } else if (
      (couponData && couponData.expiredDate < moment().format("YYYY-MM-DD")) ||
      (giftCardData && giftCardData.expiredDate < moment().format("YYYY-MM-DD"))
    ) {
      toast.error("This discount code is expired");
      setDiscount(null);
    } else if (
      (couponData && couponData.count < 0) ||
      (giftCardData && giftCardData.count < 0)
    ) {
      toast.error("This discount code usage limit exceeded");
      setDiscount(null);
    } else {
      const appliedDiscount =
        discountOption === "coupon" ? couponData : giftCardData;
      console.log(appliedDiscount);
      setDiscount(appliedDiscount);
      toast.success("Discount applied");
    }
  };

  const calculateDiscount = () => {
    if (!discount) return 0;

    if (!discount.type) {
      return discount.amount;
    }

    if (discount.type === "fixed") {
      return discount.amount;
    } else if (discount.type === "percentage") {
      return (subTotal * discount.amount) / 100;
    }

    return 0;
  };

  const discountAmount = calculateDiscount();

  useEffect(() => {
    setGrandTotal(subTotal + shippingFee - discountAmount);
  }, [subTotal, shippingFee, discountAmount, setGrandTotal]);

  return (
    <>
      <div className="space-y-2 p-5 border-2 border-primary rounded-lg mb-4">
        <p className="font-semibold">Discount Option</p>
        <Radio.Group
          value={discountOption}
          onChange={(e) => setDiscountOption(e.target.value)}
        >
          <Radio value="coupon">Coupon</Radio>
          <Radio value="giftCard">Gift Card</Radio>
        </Radio.Group>
        <div className="flex items-center gap-2 w-full mt-2">
          <Input
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
          />
          <Button type="primary" onClick={handleCode}>
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-5 border-2 border-primary rounded-lg mb-4">
        <p className="font-semibold">Delivery Option</p>
        <Radio.Group
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
        >
          <Radio value="insideDhaka">Inside Dhaka</Radio>
          <Radio value="outsideDhaka">Outside Dhaka</Radio>
        </Radio.Group>
      </div>

      <div className="bg-primaryLight p-5 rounded-lg border-2 border-primary space-y-3 font-semibold">
        <div className="flex justify-between items-center gap-20">
          <p>Sub Total</p>
          <p>{globalData?.results?.currency + " " + subTotal || 0}</p>
        </div>

        <div className="flex justify-between items-center gap-20">
          <p>Shipping Fee</p>
          <p>{globalData?.results?.currency + " " + shippingFee || 0}</p>
        </div>

        <div className="flex justify-between items-center gap-20">
          <p>Discount</p>
          <p>{globalData?.results?.currency + " " + discountAmount || 0}</p>
        </div>

        <hr className="border border-primary" />

        <div className="flex justify-between items-center gap-20">
          <p>Grand Total</p>
          <p>{globalData?.results?.currency + " " + grandTotal || 0}</p>
        </div>
      </div>
    </>
  );
};

export default CheckoutDetails;
