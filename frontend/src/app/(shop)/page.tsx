import HeroSection from "@/components/home/Herosection";
import FeaturesSection from "@/components/home/Featuressection";
import FeaturedProducts from "@/components/home/Featuredproducts";
import FeaturedCategories from "@/components/home/Featuredcategories";
import CafeMenuPreview from "@/components/home/CafeMenuPreview";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";

export default function ShopHomePage() {
  return (
    <>
      <HeroSection />

      <FeaturesSection />

      <FeaturedProducts />

      <FeaturedCategories />

      <CafeMenuPreview />

      <AboutSection />

      <GallerySection />
    </>
  );
}
