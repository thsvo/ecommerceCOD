"use client";

import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Rate } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaPlay, FaWhatsapp } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "../Home/Products/ProductCard";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter(
      (item) =>
        item?.status !== "Inactive" &&
        item?.name !== singleProduct?.name &&
        item?.category?.name === singleProduct?.category?.name
    )
    ?.slice(0, 8);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
      const updatedVariant = singleProduct?.variants?.find((variant) =>
        Object.entries(selectedAttributes).every(([attrName, selectedValue]) =>
          variant.attributeCombination.some(
            (attr) =>
              attr.attribute.name === attrName && attr.name === selectedValue
          )
        )
      );
      setCurrentVariant(updatedVariant);

      if (updatedVariant?.images && Array.isArray(updatedVariant.images)) {
        const validImages = updatedVariant.images.filter(Boolean);
        setVariantMedia(validImages.map((image) => formatImagePath(image)));
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

  return (
    <section className="container mx-auto px-2 py-5 lg:py-10">
      <div className="border-2 border-primary rounded-xl p-5 flex flex-col lg:flex-row items-center justify-center gap-10 mb-10 shadow-xl">
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
                  height={450}
                  width={450}
                  className="mx-auto rounded-xl"
                />
              </Zoom>
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="flex flex-row lg:flex-col justify-start gap-2 mt-5 max-h-[400px] w-[300px] lg:w-auto xl:w-[142px] border rounded-xl p-4 !overflow-x-auto lg:overflow-y-auto thumbnail">
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
        <div className="lg:w-1/2 flex flex-col text-sm lg:text-base">
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
            <Rate disabled value={singleProduct?.ratings?.average} allowHalf />(
            {singleProduct?.ratings?.count})
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
          <ProductCountCart
            item={singleProduct}
            previousSelectedVariant={currentVariant}
            setPreviousSelectedVariant={setCurrentVariant}
            fullWidth
            selectedPreviousAttributes={selectedAttributes}
          />
          <div
            className="w-full bg-primary px-10 py-2 text-xs lg:text-sm rounded-full shadow-xl mt-10 text-center text-white font-bold cursor-pointer"
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
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl bg-white">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-medium rounded-lg inline-block">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
      </div>
      {activeProducts && activeProducts.length > 0 ? (
        <div className="mt-20 bg-white rounded-xl shadow-xl p-5">
          <h2 className="text-xl md:text-3xl font-medium text-center mb-10">
            Similar Products
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-8 lg:gap-y-14 pb-10">
            {activeProducts.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SingleProductDetails;
