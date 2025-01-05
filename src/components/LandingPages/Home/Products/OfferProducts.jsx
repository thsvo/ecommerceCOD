"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";

const OfferProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    ?.sort((a, b) => (b?.ratings?.average || 0) - (a?.ratings?.average || 0))
    ?.slice(0, 8);

  return (
    <div className="my-container bg-white shadow-xl py-10 rounded-xl mt-10">
      <h2 className="text-xl md:text-3xl font-medium text-center mb-10">
        Top Selling Products
      </h2>
      {activeProducts?.length > 0 ? (
        <div className="flex flex-wrap gap-x-5 gap-y-8 lg:gap-y-14 pb-10">
          {activeProducts?.map((product) => (
            <ProductCard key={product?._id} item={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center my-10 bg-white p-10 rounded-xl shadow-xl">
          <h2 className="lg:text-2xl font-bold text-black/80 text-center text-xl">
            No top selling products available
          </h2>
        </div>
      )}
    </div>
  );
};

export default OfferProducts;
