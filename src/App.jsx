import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import './App.css';

/* ─── Eagerly loaded (always needed immediately) ─── */
import ComingSoon from './pages/ComingSoon';
import Homepage   from './pages/Homepage';

/* ─── Lazily loaded (only downloaded when visited) ─── */
const Login       = lazy(() => import('./pages/Login'));
const Signup      = lazy(() => import('./pages/Signup'));
const Logout      = lazy(() => import('./pages/Logout'));
const Team        = lazy(() => import('./pages/Company/Team'));
const Contact     = lazy(() => import('./pages/Company/Contact'));
const News        = lazy(() => import('./pages/News/News'));
const NewsArticle = lazy(() => import('./pages/News/NewsArticle'));
const About       = lazy(() => import('./pages/About'));
const Help        = lazy(() => import('./pages/Resources/Help'));
const Privacy     = lazy(() => import('./pages/Resources/Privacy'));
const Terms       = lazy(() => import('./pages/Resources/Terms'));

/* ─── Minimal fallback shown while a chunk loads ─── */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" aria-label="Loading" />
    </div>
  );
}

/* ─── Scrolls to top on every route change, but preserves hash targets ─── */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Let the page render, then scroll to the hash element
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Small delay so lazy-loaded content finishes mounting
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"           element={<ComingSoon />} />
          <Route path="/homepage"   element={<Homepage />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/signup"     element={<Signup />} />
          <Route path="/logout"     element={<Logout />} />
          <Route path="/team"       element={<Team />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/news"       element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/about"      element={<About />} />
          <Route path="/help"       element={<Help />} />
          <Route path="/privacy"    element={<Privacy />} />
          <Route path="/terms"      element={<Terms />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;