import AllProducts from "@/components/LandingPages/Products/AllProducts";

const page = (param) => {
  return (
    <>
      <AllProducts searchParams={param?.searchParams?.filter} />
    </>
  );
};

export default page;
