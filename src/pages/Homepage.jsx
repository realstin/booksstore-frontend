import Navbar from './components/Homepage/Navbar';
import Hero from './components/Homepage/Hero';
import Statistics from './components/Homepage/Statistics';
import WhyBookStore from './components/Homepage/WhyBookStore';

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statistics />
      <WhyBookStore />
    </>
  );
}

export default Homepage;