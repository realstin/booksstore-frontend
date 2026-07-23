import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ComingSoon from './pages/ComingSoon';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Team from './pages/Company/Team';
import Contact from './pages/Company/Contact';
import News from './pages/News/News';
import NewsArticle from './pages/News/NewsArticle';
import './App.css';

/* Scrolls to the top of the page on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"          element={<ComingSoon />} />
        <Route path="/homepage"  element={<Homepage />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/logout"    element={<Logout />} />
        <Route path="/team"      element={<Team />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/news"      element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;