import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <CategorySection />
      </main>

      <Footer />
    </>
  );
}

export default Home;