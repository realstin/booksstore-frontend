import Navbar from '../components/Homepage/Navbar';
import Hero from '../components/Homepage/Hero';
import Statistics from '../components/Homepage/Statistics';
import Features from '../components/Homepage/Features';
import ReadingExperience from '../components/Homepage/ReadingExperience';
import CommunityFavorites from '../components/Homepage/CommunityFavorites';
import Partners from '../components/Homepage/Parteners';
import CTA from '../components/Homepage/CTA';
import Footer from '../components/Homepage/Footer';

/*
  Homepage section order — simplified:
  Hero → Statistics → Features → ReadingExperience
  → CommunityFavorites → Partners → CTA → Footer

  Removed:
  - WhyBookStore  (duplicate of Features — same card grid pattern)
  - FutureOfBookStore  (roadmap premature at current scale)
*/
function Homepage() {
  return (
    <>
      <Navbar />
      <div className="h-20" aria-hidden="true" />
      <Hero />
      <Statistics />
      <Features />
      <ReadingExperience />
      <CommunityFavorites />
      <Partners />
      <CTA />
      <Footer />
    </>
  );
}

export default Homepage;
