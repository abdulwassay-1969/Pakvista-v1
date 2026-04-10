import HeroSection from '@/components/sections/hero-section';
import DistrictsSection from '@/components/sections/districts-section';
import TourismIntroSection from '@/components/sections/tourism-intro-section';
import WeatherBar from '@/components/sections/weather-bar';
import FeaturedDestinationsSection from '@/components/sections/featured-destinations-section';
import VisualGallerySection from '@/components/sections/visual-gallery-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WeatherBar />
      <TourismIntroSection />
      <FeaturedDestinationsSection />
      <DistrictsSection />
      <VisualGallerySection />
    </>
  );
}
