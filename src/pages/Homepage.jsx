import Navbar from '../components/Homepage/Navbar';
import Hero from '../components/Homepage/Hero';
import Statistics from '../components/Homepage/Statistics';
import WhyBookStore from '../components/Homepage/WhyBookStore';
import Features from '../components/Homepage/Features';
import ReadingExperience from '../components/Homepage/ReadingExperience';
import CommunityFavorites from '../components/Homepage/CommunityFavorites';
import FutureOfBookStore from '../components/Homepage/FutureOfBookStore';
import Partners from '../components/Homepage/Parteners';
import CTA from '../components/Homepage/CTA';
import Footer from '../components/Homepage/Footer';

function Homepage() {
  return (
    <>
      <Navbar />

      <div className="h-20" aria-hidden="true" />
      <Hero />
      <Statistics />
      <WhyBookStore />
      <Features />
      <ReadingExperience />
      <CommunityFavorites />
      <FutureOfBookStore />
      <Partners />
      <CTA />
      <Footer />
    </>
  );
}

export default Homepage;