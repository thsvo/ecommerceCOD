"use client";

import { useEffect, useState } from "react";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { Rate } from "antd";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import { FaWhatsapp, FaPlay, FaMinus, FaPlus } from "react-icons/fa";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import SingleProductCart from "./SingleProductCart";
import { toast } from "sonner";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";

const SinglePageCart = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [count, setCount] = useState(1);
  const [variantMedia, setVariantMedia] = useState([]);

  const groupedAttributes = singleProduct?.variants?.reduce((acc, variant) => {
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

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
      setVariantMedia([]);
    } else {
      const updatedVariant = singleProduct?.variants.find((variant) =>
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

      if (updatedVariant?.images) {
        setVariantMedia(
          updatedVariant.images.map((image) => formatImagePath(image))
        );
      } else {
        setVariantMedia([]);
      }
    }
  }, [selectedAttributes, singleProduct]);

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : singleProduct?.offerPrice ?? singleProduct?.sellingPrice;

  const currentImage = selectedImage
    ? selectedImage
    : currentVariant?.images && currentVariant.images.length > 0
    ? formatImagePath(currentVariant.images[0])
    : formatImagePath(singleProduct?.mainImage);

  const allMedia =
    variantMedia.length > 0
      ? [
          ...variantMedia,
          singleProduct?.video ? "video-thumbnail" : null,
        ].filter(Boolean)
      : [
          singleProduct?.mainImage
            ? formatImagePath(singleProduct.mainImage)
            : null,
          ...(Array.isArray(singleProduct?.images)
            ? singleProduct.images.map((image) =>
                image ? formatImagePath(image) : null
              )
            : []),
          ...(Array.isArray(singleProduct?.variants)
            ? singleProduct.variants.flatMap((variant) =>
                Array.isArray(variant.images)
                  ? variant.images.map((image) =>
                      image ? formatImagePath(image) : null
                    )
                  : []
              )
            : []),
          singleProduct?.video ? "video-thumbnail" : null,
        ].filter(Boolean);

  const handleMediaClick = (media) => {
    if (media === "video-thumbnail") {
      setIsVideoPlaying(true);
      setSelectedImage(null);
      setVariantMedia([]);
    } else {
      setIsVideoPlaying(false);
      setSelectedImage(media);
    }
  };

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

  const isOutOfStock = singleProduct?.stock <= 0 || currentVariant?.stock <= 0;
  return (
    <section className="container mx-auto px-2 lg:px-5 lg:py-10">
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mb-10">
          <div className="relative mx-auto flex flex-col lg:flex-row-reverse items-center lg:gap-5">
            <div className="relative mx-auto lg:w-[300px] xl:w-full">
              {isVideoPlaying && singleProduct?.video ? (
                <video
                  src={formatImagePath(singleProduct?.video)}
                  controls
                  autoPlay
                  className="mx-auto rounded-xl w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              ) : currentImage ? (
                <Zoom>
                  <Image
                    src={currentImage}
                    alt="product image"
                    height={400}
                    width={400}
                    className="mx-auto rounded-xl"
                  />
                </Zoom>
              ) : (
                <p>No image available</p>
              )}
            </div>

            <div className="flex flex-row lg:flex-col justify-start gap-2 mt-5 max-h-[400px] w-[300px] lg:w-auto xl:w-[146px] border rounded-xl p-4 !overflow-x-auto lg:overflow-y-auto thumbnail">
              {allMedia?.map((media, index) => (
                <div
                  key={index}
                  onClick={() => handleMediaClick(media)}
                  className={`cursor-pointer border-2 rounded-xl ${
                    selectedImage === media ||
                    (media === "video-thumbnail" && isVideoPlaying)
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {media === "video-thumbnail" ? (
                    <div className="flex items-center justify-center bg-black rounded-xl w-20 h-20">
                      <FaPlay className="text-white text-2xl" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center bg-black rounded-xl w-20 h-20">
                        <Image
                          src={media}
                          alt={`media ${index}`}
                          height={80}
                          width={80}
                          className="object-cover rounded-xl"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col">
            <h2 className="text-xl md:text-3xl font-medium mb-2">
              {singleProduct?.name}
            </h2>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Category:</span>
              <span>{singleProduct?.category?.name}</span>
            </div>
            {singleProduct?.brand && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Brand:</span>
                <span>{singleProduct?.brand?.name}</span>
              </div>
            )}
            <div className="flex items-center mt-4 gap-4 font-medium">
              <Rate
                disabled
                value={singleProduct?.ratings?.average}
                allowHalf
              />
              ({singleProduct?.ratings?.count})
            </div>
            <div className="flex items-center gap-4 text-textColor font-medium my-2">
              Price:{" "}
              <p className="text-primary text-xl">
                {globalData?.results?.currency + " " + currentPrice}
              </p>
              {singleProduct?.offerPrice && (
                <p className="text-base line-through text-red-500">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.sellingPrice}
                </p>
              )}
            </div>

            <AttributeOptionSelector
              groupedAttributes={groupedAttributes}
              selectedAttributes={selectedAttributes}
              handleAttributeSelect={handleAttributeSelect}
              item={singleProduct}
            />

            {!isOutOfStock ? (
              <>
                <div className="flex items-center justify-start w-[7.5rem] gap-3 border border-primary rounded-xl p-1.5 mt-5">
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("decrement")}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-base font-bold text-textColor">
                    {count}
                  </span>
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("increment")}
                  >
                    <FaPlus />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
                Out Of Stock
              </div>
            )}
            <div
              className="w-full bg-primary px-10 py-2 text-sm rounded-full shadow-xl mt-10 text-center text-white font-bold cursor-pointer"
              onClick={handleWhatsappClick}
            >
              <p>Click To Place a Order With Just a Phone Call</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FaWhatsapp className="text-2xl" />
                <p>{businessWhatsapp}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <SingleProductCart
            item={currentVariant ?? singleProduct}
            count={count}
            productId={singleProduct?._id}
            productName={singleProduct?.name}
          />
        </div>
      </div>
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl bg-white flex flex-col justify-start">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-bold rounded-xl">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
      </div>
    </section>
  );
};

export default SinglePageCart;
