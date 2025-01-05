import { smallFeatureData } from "@/assets/data/smallFeatureData";
import Image from "next/image";
import React from "react";

const SmallFeature = () => {
  return (
    <section className="pb-10 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center items-center gap-10">
        {smallFeatureData?.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 justify-center bg-white rounded-xl p-5"
          >
            <Image src={item?.image} alt={item?.name} width={60} height={60} />
            <div>
              <h3 className="text-base font-bold mb-1">{item?.name}</h3>
              <p className="text-textColor text-sm">{item?.feature}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmallFeature;
