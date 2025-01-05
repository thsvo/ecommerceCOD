"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";

const AllOffers = () => {
  const { data: productData } = useGetAllProductsQuery();

  const filteredProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.offerPrice > 0
  );

  return (
    <section>
      <div className="lg:my-10 relative xl:container lg:px-5 mx-auto">
        <div className="px-2 lg:px-5 bg-white shadow-xl rounded-xl py-5 lg:py-10">
          {filteredProducts?.length ? (
            <>
              <h2 className="text-xl lg:text-3xl font-medium text-center mb-5 lg:mb-10">
                Offer Products
              </h2>
              <div className="flex flex-wrap xxl:grid xxl:grid-cols-4 gap-x-2 gap-y-5 lg:gap-10 lg:mt-10">
                {filteredProducts?.map((product) => (
                  <ProductCard key={product?._id} item={product} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center">
              No offer products available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllOffers;
