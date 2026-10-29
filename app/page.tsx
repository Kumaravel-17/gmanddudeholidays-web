import Banner from "./components/Banner";
import BusTypes from "./components/BusTypes";
import Faq from "./components/Faq";
import FleetShowcase from "./components/FleetShowcase";
import FleetStats from "./components/FleetStats";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";
import TripTypes from "./components/TripTypes";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Banner
        image={{
          src: "/images/hero-bus-banner.jpg",
          alt: "GM & Dude Holidays tourist coach on a mountain road above a lake",
        }}
      />
      <BusTypes />
      <FleetShowcase />
      <HowItWorks />
      <TripTypes />
      <FleetStats />
      <Faq />
      <Footer />
    </main>
  );
}
