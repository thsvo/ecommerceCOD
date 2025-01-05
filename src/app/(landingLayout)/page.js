import Banner from "@/components/LandingPages/Home/Banner";
import SmallFeature from "@/components/LandingPages/Home/SmallFeature";
import Categories from "@/components/LandingPages/Home/Categories";
import Brands from "@/components/LandingPages/Home/Brands";
import PopularProducts from "@/components/LandingPages/Home/Products/PopularProducts";
import OfferProducts from "@/components/LandingPages/Home/Products/OfferProducts";
import NewsletterBanner from "@/components/LandingPages/Home/NewsletterBanner";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart website.",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Categories />
      <Brands />
      <PopularProducts />
      <OfferProducts />
      <NewsletterBanner />
      <SmallFeature />
    </div>
  );
};

export default page;
