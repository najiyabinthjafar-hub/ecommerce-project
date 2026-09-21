import { useEffect } from "react";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import SummerSection from "../components/SummerSection";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import InstagramSection from "../components/InstagramSection";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  useEffect(() => {
    // Home page is treated as a fresh starting point
    window.history.replaceState(null, "", "/");
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <SummerSection />
      <NewArrivals />
      <BestSellers />
      <InstagramSection />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;