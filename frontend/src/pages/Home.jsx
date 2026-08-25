import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";
import SummerSection from "../components/SummerSection";
import NewArrivals from "../components/NewArrivals";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <CategorySection />
         <SummerSection />
         <NewArrivals />
      </main>

      <Footer />
    </>
  );
}

export default Home;