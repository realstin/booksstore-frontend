import Navbar from './components/Homepage/Navbar';
import Hero from './components/Homepage/Hero';
import Statistics from './components/Homepage/Statistics';
import WhyBookStore from './components/Homepage/WhyBookStore';
import Features from './components/Homepage/Features';

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statistics />
      <WhyBookStore />
      <Features />
    </>
  );
}

export default Homepage;