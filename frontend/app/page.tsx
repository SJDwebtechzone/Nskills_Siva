import BannerSection from "./components/BannerSection";
import AboutSection from "./components/AboutSection";
import VisionSection from "./components/VisionSection";
import WhyUsSection from "./components/WhyUsSection";
import TeamSection from "./components/TeamSection";
import LatestNewsSection from "./components/LatestNewsSection";
import AccreditationsSection from "./components/AccreditationsSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white w-full">
      {/* Banner Section */}
      <div className="w-full max-w-7xl px-6 py-6 space-y-16">
        <BannerSection />
      </div>

      {/* About Section */}
      <div className="w-full">
        <AboutSection />
      </div>

      {/* Vision, Mission, Values Section */}
      <div className="w-full">
        <VisionSection />
      </div>

      {/* Why Us Section */}
      <div className="w-full">
        <WhyUsSection />
      </div>

      {/* Team Section */}
      <div className="w-full">
        <TeamSection />
      </div>

      {/* Latest News Section */}
      <div className="w-full">
        <LatestNewsSection />
      </div>

      {/* Accreditations Section */}
      <div className="w-full">
        <AccreditationsSection />
      </div>
    </div>
  );
}