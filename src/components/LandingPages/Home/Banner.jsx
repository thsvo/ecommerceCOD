"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import LinkButton from "@/components/Shared/LinkButton";

const Banner = () => {
  const swiperRef = useRef();

  const { data: sliders } = useGetAllSlidersQuery();

  const activeSliders = sliders?.results?.filter(
    (item) => item.status === "Active"
  );

  return (
    <section className="relative mb-10">
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        slidesPerView={1}
        navigation
        className="mySwiper max-h-[600px]"
      >
        {activeSliders?.map((item) => {
          return (
            <SwiperSlide key={item?._id}>
              <LinkButton href={`/products?filter=${item?.category?.name}`}>
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "Demo"}
                  width={2000}
                  height={600}
                  className="h-[150px] lg:h-fit w-full object-cover"
                />
              </LinkButton>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="flex items-center justify-between gap-5 mt-10">
        <button
          className="z-10 lg:w-6 lg:h-6 flex items-center justify-center rounded-full bg-white text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[35%] lg:top-[45%] left-5 lg:left-10"
          onClick={() => swiperRef.current.slidePrev()}
        >
          <FaAngleLeft className="text-xl" />
        </button>
        <button
          className="z-10 lg:w-6 lg:h-6 flex items-center justify-center rounded-full bg-white text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[35%] lg:top-[45%] right-5 lg:right-10"
          onClick={() => swiperRef.current.slideNext()}
        >
          <FaAngleRight className="text-xl" />
        </button>
      </div>
      <div className="custom-pagination flex justify-center space-x-2 absolute bottom-20 z-10 left-1/2"></div>
    </section>
  );
};

export default Banner;
