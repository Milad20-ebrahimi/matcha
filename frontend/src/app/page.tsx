import HeroSection from "@/components/home/Herosection";
import FeaturedCategories from "@/components/home/Featuredcategories";
import FeaturedProducts from "@/components/home/Featuredproducts";
import CafeSection from "@/components/home/Cafesection";
import ReviewsSection from "@/components/home/Reviewssection";


export default function Home() {
  return (
    <>

      <HeroSection />

      <FeaturedCategories />

      <FeaturedProducts />

      <CafeSection />

      <ReviewsSection />

    </>
  );
}
