"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import Link from "next/link";

const Brands = () => {
  const swiperRef = useRef();

  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  if (!activeBrands)
    return (
      <p className="text-center">There is no brands available right now</p>
    );

  return (
    <section className="my-container bg-white shadow-xl p-5 rounded-xl mt-10">
      <h2 className="text-xl md:text-2xl font-medium text-center mb-10">
        Our Brands
      </h2>
      {activeBrands?.length === 0 ? (
        <p className="text-center my-5">
          There is no brands available right now
        </p>
      ) : (
        <div className="relative">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1100: { slidesPerView: 4 },
            }}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper !py-5"
          >
            {activeBrands?.map((item) => {
              return (
                <SwiperSlide key={item?._id}>
                  <Link href={`/products?filter=${item?.name}`}>
                    <div className="group cursor-pointer rounded-xl mx-auto flex gap-20 justify-center items-center shadow-xl w-[160px] h-[160px] lg:w-[300px] lg:h-[300px]">
                      <Image
                        src={
                          item?.attachment ??
                          "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                        }
                        alt={item.name}
                        width={300}
                        height={300}
                        className="rounded-xl w-[160px] h-[160px] lg:w-[300px] lg:h-[300px]"
                      />
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex items-center justify-between gap-5 mt-10">
            <button
              className="z-10 lg:w-6 lg:h-6 flex items-center justify-center rounded-full bg-white text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] lg:top-[45%] left-0"
              onClick={() => swiperRef.current.slidePrev()}
            >
              <FaAngleLeft className="text-xl" />
            </button>
            <button
              className="z-10 lg:w-6 lg:h-6 flex items-center justify-center rounded-full bg-white text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] lg:top-[45%] right-0"
              onClick={() => swiperRef.current.slideNext()}
            >
              <FaAngleRight className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Brands;
