import HeroSection from "@/components/home/Herosection";
import FeaturesSection from "@/components/home/Featuressection";
import FeaturedCategories from "@/components/home/Featuredcategories";
import FeaturedProducts from "@/components/home/Featuredproducts";
import CafeMenuPreview from "@/components/home/CafeMenuPreview";
import CafeSection from "@/components/home/Cafesection";
import ReviewsSection from "@/components/home/Reviewssection";

export default function ShopHomePage() {
  return (
    <>
      <HeroSection />

      <FeaturesSection />

      <FeaturedProducts />

      <FeaturedCategories />

      <CafeMenuPreview />

      <CafeSection />

      <ReviewsSection />
    </>
  );
}
