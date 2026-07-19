import Navbar from './components/Homepage/Navbar';
import Hero from './components/Homepage/Hero';
import Statistics from './components/Homepage/Statistics';
import WhyBookStore from './components/Homepage/WhyBookStore';
import Features from './components/Homepage/Features';
import ReadingExperience from './components/Homepage/ReadingExperience';
import CommunityFavorites from './components/Homepage/CommunityFavorites';
import FutureOfBookStore from './components/Homepage/FutureOfBookStore';
import Partners from './components/Homepage/Parteners';

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statistics />
      <WhyBookStore />
      <Features />
      <ReadingExperience />
      <CommunityFavorites />
      <FutureOfBookStore />
      <Partners />
    </>
  );
}

export default Homepage;