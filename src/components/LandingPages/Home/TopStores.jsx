import { storeData } from "@/assets/data/storeData";
import { Button, Rate } from "antd";
import Image from "next/image";
import { FaArrowRight, FaLocationDot, FaPhone } from "react-icons/fa6";

const TopStores = () => {
  return (
    <section className="container mx-auto px-5 py-10">
      <h2 className="text-4xl font-bold text-center lg:text-start">
        Top Stores
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 justify-center items-center gap-6 mt-10">
        {storeData?.map((item) => (
          <div
            key={item?.id}
            className="flex flex-col justify-start items-start text-start bg-gray-100 rounded-xl shadow-xl relative group border-2 border-primaryLight px-5 pb-5 hover:border-primary duration-500"
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <Image src={item?.image} alt={item?.name} width={200} height />
            </div>
            <div className="mt-10">
              <p>Since {item?.year}</p>

              <h2 className="text-2xl font-bold my-2">{item?.name}</h2>
              <p>({item?.products} Products)</p>
              <div className="flex items-center mt-4 gap-4 font-bold">
                <Rate disabled value={item?.review} allowHalf />({item?.review})
              </div>
              <div className="flex items-center gap-2 lg:w-5/6 mt-6">
                <FaLocationDot className="text-primary" />
                <p className="text-textColor">
                  <span className="font-semibold">Address: </span>
                  {item?.address}
                </p>
              </div>
              <div className="flex items-center gap-2 lg:w-5/6 mt-2">
                <FaPhone className="text-primary" />
                <p className="text-textColor">
                  <span className="font-semibold">Phone:</span> {item?.contact}
                </p>
              </div>
              <div>
                <Button
                  type="primary"
                  className="flex items-center group w-full group justify-center mt-10"
                  style={{
                    padding: "1.5rem 0px 1.5rem 0px",
                    display: "flex",
                    alignContent: "center",
                    gap: "5px",
                  }}
                >
                  <span className="font-bold duration-300">Visit Store</span>
                  <FaArrowRight />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopStores;
