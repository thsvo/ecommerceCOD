"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useDeleteWishlistMutation } from "@/redux/services/wishlist/wishlistApi";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProductCountCart = ({
  item,
  single,
  handleModalClose = () => {},
  fullWidth,
  previousSelectedVariant,
  isWishlist,
  wishlistId,
  selectedPreviousAttributes,
}) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const [addCart, { isLoading }] = useAddCartMutation();
  const [btnText, setBtnText] = useState("");
  const [deleteWishlist] = useDeleteWishlistMutation();

  const handleCount = (action) => {
    if (action === "increment") {
      setCount((prev) => prev + 1);
    } else if (action === "decrement") {
      if (count > 1) {
        setCount((prev) => prev - 1);
      } else {
        toast.info("Count cannot be less than one");
      }
    }
  };
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const groupedAttributes = item?.variants?.reduce((acc, variant) => {
    variant.attributeCombination.forEach((attribute) => {
      const attributeName = attribute.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].some((opt) => opt.name === attribute.name)) {
        acc[attributeName].push({
          name: attribute.name,
          label: attribute.label || attribute.name,
          _id: attribute._id,
        });
      }
    });
    return acc;
  }, {});

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  const [currentVariant, setCurrentVariant] = useState(
    previousSelectedVariant ||
      item?.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([attrName, selectedValue]) => {
            return variant.attributeCombination.some(
              (attr) =>
                attr.attribute.name === attrName && attr.name === selectedValue
            );
          }
        )
      )
  );

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
    } else {
      const updatedVariant = item?.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([attrName, selectedValue]) => {
            return variant.attributeCombination.some(
              (attr) =>
                attr.attribute.name === attrName && attr.name === selectedValue
            );
          }
        )
      );
      setCurrentVariant(updatedVariant);
    }
  }, [selectedAttributes, item?.variants]);

  useEffect(() => {
    if (selectedPreviousAttributes) {
      setSelectedAttributes(selectedPreviousAttributes);
    }
    if (previousSelectedVariant) {
      setCurrentVariant(previousSelectedVariant);
    }
  }, [selectedPreviousAttributes, previousSelectedVariant]);

  const allAttributesSelected =
    currentVariant &&
    Object.keys(groupedAttributes).length ===
      Object.keys(selectedAttributes).length;

  const isOutOfStock =
    item?.stock <= 0 ||
    previousSelectedVariant?.stock <= 0 ||
    currentVariant?.stock <= 0;

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : item?.sellingPrice;

  const addToCart = async (type) => {
    if (item?.variants?.length > 0 && !allAttributesSelected) {
      setOpenVariantModal(true);
      setBtnText(type);
      toast.info("Please select a variant combination");
      return;
    }

    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: item?._id,
      quantity: count,
      sku: currentVariant?.sku ?? item?.sku,
      price: currentVariant?.sellingPrice
        ? currentVariant?.sellingPrice
        : item?.offerPrice
        ? item?.offerPrice
        : item?.sellingPrice,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
        if (isWishlist) {
          deleteWishlist(wishlistId);
        }
        handleModalClose();
        setCount(1);
        setOpenVariantModal(false);
        setCurrentVariant(previousSelectedVariant);
        if (type === "buy") {
          router.push("/cart");
        }
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
      className={`mt-5 lg:mt-10 ${
        single
          ? "gap-5 flex flex-col xl:flex-row items-center"
          : "flex flex-col xl:flex-row items-center justify-between gap-5"
      }`}
    >
      {!isOutOfStock ? (
        <>
          <div className="flex items-center gap-3 border border-primaryLight rounded-xl p-1.5">
            <button
              className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
              onClick={() => handleCount("decrement")}
            >
              <FaMinus />
            </button>
            <span className="text-base font-bold text-textColor">{count}</span>
            <button
              className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
              onClick={() => handleCount("increment")}
            >
              <FaPlus />
            </button>
          </div>
          <SubmitButton
            func={() => addToCart("cart")}
            text={"Add"}
            icon={<FaCartShopping />}
            loading={isLoading}
            fullWidth={fullWidth}
          />
          <SubmitButton
            func={() => addToCart("buy")}
            text={"Buy Now"}
            icon={<FaCartShopping />}
            loading={isLoading}
            fullWidth={fullWidth}
          />
        </>
      ) : (
        <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
          Out Of Stock
        </div>
      )}
      <Modal
        open={openVariantModal}
        onCancel={() => setOpenVariantModal(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4 p-5">
          <AttributeOptionSelector
            groupedAttributes={groupedAttributes}
            selectedAttributes={selectedAttributes}
            handleAttributeSelect={handleAttributeSelect}
            item={item}
          />

          <div className="flex items-center gap-4 text-textColor font-bold my-2">
            Price:{" "}
            {item?.offerPrice ? (
              <p className="text-primary text-xl">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-primary text-xl">
                {globalData?.results?.currency + " " + currentPrice}
              </p>
            )}
            {item?.offerPrice && (
              <p className="text-base line-through text-red-500">
                {globalData?.results?.currency + " " + currentPrice}
              </p>
            )}
          </div>

          {isOutOfStock ? (
            <>
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10 text-center">
                Out Of Stock
              </div>
            </>
          ) : (
            <>
              {btnText === "buy" ? (
                <SubmitButton
                  func={() => addToCart("buy")}
                  text={"Buy Now"}
                  icon={<FaCartShopping />}
                  loading={isLoading}
                  fullWidth={fullWidth}
                />
              ) : (
                <SubmitButton
                  func={() => addToCart("cart")}
                  text={"Add"}
                  icon={<FaCartShopping />}
                  loading={isLoading}
                  fullWidth={fullWidth}
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductCountCart;
