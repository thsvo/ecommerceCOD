"use client";

import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

const Categories = () => {
  const swiperRef = useRef();
  const { data: categories } = useGetAllCategoriesQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="py-10 relative my-container bg-white shadow-xl p-5 rounded-xl">
      <h2 className="text-xl md:text-2xl font-medium text-center">
        Find Your Items By Category
      </h2>
      <div className="mt-10 hidden md:flex flex-wrap justify-center items-center gap-10 py-5">
        {activeCategories?.slice(0, 9).map((category) => (
          <Link
            href={`/products?filter=${category?.name}`}
            key={category?._id}
            className="text-center relative"
          >
            <div className="group cursor-pointer overflow-hidden w-[350px] h-[350px] rounded-xl mx-auto">
              <Image
                src={
                  category?.attachment ??
                  "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                }
                alt={category?.name}
                width={350}
                height={350}
                className="group-hover:scale-110 duration-500 object-cover rounded-xl mx-auto"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 rounded-b-xl">
              <h3 className={`font-semibold text-xl text-center text-white`}>
                {category?.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 md:hidden">
        {activeCategories?.length === 0 ? (
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
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 5 },
              }}
              navigation
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="mySwiper"
            >
              {activeCategories?.map((category) => {
                return (
                  <SwiperSlide key={category?._id}>
                    <Link
                      href={`/products?filter=${category?.name}`}
                      key={category?._id}
                      className="text-center relative"
                    >
                      <div className="group cursor-pointer overflow-hidden w-[300px] h-[300px] rounded-xl mx-auto">
                        <Image
                          src={
                            category?.attachment ??
                            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                          }
                          alt={category?.name}
                          width={300}
                          height={300}
                          className="group-hover:scale-110 duration-500 object-cover rounded-xl mx-auto"
                        />
                      </div>
                      <h3
                        className={`font-semibold text-xl absolute bottom-6 left-0 right-0 ${
                          category?.attachment ? "text-white" : "text-primary"
                        }`}
                      >
                        {category?.name}
                      </h3>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div className="flex items-center justify-between gap-5 mt-10">
              <button
                className="z-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-transparent text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] left-0"
                onClick={() => swiperRef.current.slidePrev()}
              >
                <FaAngleLeft className="text-xl" />
              </button>
              <button
                className="z-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-transparent text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] right-0"
                onClick={() => swiperRef.current.slideNext()}
              >
                <FaAngleRight className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
