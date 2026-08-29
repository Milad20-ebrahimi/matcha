
import HeroSection from "@/components/home/Herosection";
import FeaturesSection from "@/components/home/Featuressection";
import FeaturedProducts from "@/components/home/Featuredproducts";
import FeaturedCategories from "@/components/home/Featuredcategories";
import CafeMenuPreview from "@/components/home/CafeMenuPreview";
import AboutSection from "@/components/home/AboutSection";
import ReservationSection from "@/components/home/ReservationSection";
import GallerySection from "@/components/home/GallerySection";
import PlaylistSection from "@/components/home/PlaylistSection";

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

      <ReservationSection />

      <PlaylistSection />
    </>
  );
}
