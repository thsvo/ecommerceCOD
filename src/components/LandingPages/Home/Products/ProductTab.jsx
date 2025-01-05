"use client";

import { useState, useRef } from "react";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Tabs } from "antd";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

const tabs = ["Featured", "Best Offer", "Top Rated", "New Arrivals"];

const ProductTab = () => {
  const swiperRef = useRef(null);
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const [activeTab, setActiveTab] = useState("Featured");

  const filteredProducts = (tab) => {
    switch (tab) {
      case "Featured":
        return activeProducts?.filter((product) => product?.isFeatured);
      case "Best Offer":
        return activeProducts
          ?.filter((product) => product?.offerPrice > 0)
          .slice(0, 8);
      case "Top Rated":
        return activeProducts
          ?.sort(
            (a, b) => (b?.ratings?.average || 0) - (a?.ratings?.average || 0)
          )
          .slice(0, 8);
      case "New Arrivals":
        return activeProducts
          ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
          .slice(0, 8);
      default:
        return activeProducts;
    }
  };

  return (
    <section className="container mx-auto px-2 lg:px-5 relative">
      <div className="flex flex-col lg:flex-row items-center justify-between border-b">
        <Tabs
          activeKey={activeTab}
          size="large"
          className="font-semibold max-w-[350px] lg:max-w-[600px]"
          onChange={(key) => setActiveTab(key)}
        >
          {tabs?.map((item) => (
            <Tabs.TabPane tab={item} key={item} />
          ))}
        </Tabs>
      </div>

      {filteredProducts(activeTab)?.length > 0 ? (
        <div className="mt-5">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2 },
              600: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            className="mySwiper my-10 rounded-xl"
          >
            {filteredProducts(activeTab).map((product) => (
              <SwiperSlide key={product?._id}>
                <ProductCard item={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center justify-center gap-5">
            <button
              className="absolute top-[50%] -left-1 lg:top-[3%] lg:left-[92%] z-10 lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FaAngleLeft className="text-xl" />
            </button>
            <button
              className="absolute top-[50%] -right-1 lg:top-[3%] lg:right-8 z-10 lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FaAngleRight className="text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No products found for this tab.
        </div>
      )}
    </section>
  );
};

export default ProductTab;
