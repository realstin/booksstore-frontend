import Navbar from './components/Homepage/Navbar';
import Hero from './components/Homepage/Hero';
import Statistics from './components/Homepage/Statistics';
import WhyBookStore from './components/Homepage/WhyBookStore';
import Features from './components/Homepage/Features';
import ReadingExperience from './components/Homepage/ReadingExperience';

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statistics />
      <WhyBookStore />
      <Features />
      <ReadingExperience />
    </>
  );
}

export default Homepage;