import { BrowserRouter, Routes, Route, useLocation, Navigate, useSearchParams, useParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import './App.css';

/* ─── Eagerly loaded ─── */
import Homepage from './pages/Homepage';

/* ─── Lazily loaded — public ─── */
const Login       = lazy(() => import('./pages/Login'));
const Signup      = lazy(() => import('./pages/Signup'));
const Team        = lazy(() => import('./pages/Company/Team'));
const Contact     = lazy(() => import('./pages/Company/Contact'));
const News        = lazy(() => import('./pages/News/News'));
const NewsArticle = lazy(() => import('./pages/News/NewsArticle'));
const About       = lazy(() => import('./pages/About'));
const Help        = lazy(() => import('./pages/Resources/Help'));
const Privacy     = lazy(() => import('./pages/Resources/Privacy'));
const Terms       = lazy(() => import('./pages/Resources/Terms'));

/* ─── Lazily loaded — dashboard pages ─── */
const Dashboard         = lazy(() => import('./pages/Dashboard/Dashboard'));
const DashboardExplore  = lazy(() => import('./pages/Dashboard/Explore'));
const DashboardLibrary  = lazy(() => import('./pages/Dashboard/Library'));
const DashboardProfile  = lazy(() => import('./pages/Dashboard/Profile'));
const DashboardSettings = lazy(() => import('./pages/Dashboard/Settings'));
const BookDetails       = lazy(() => import('./pages/Dashboard/BookDetails'));
const BookReader        = lazy(() => import('./pages/Dashboard/BookReader'));
const BookReaderV2      = lazy(() => import('./pages/Dashboard/BookReaderV2'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" aria-label="Loading…" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const timer = setTimeout(() => { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

function HomepageGuard() {
  const { user, isInitialized } = useAuth();
  if (isInitialized && user) return <Navigate to="/home" replace />;
  return <Homepage />;
}

function RedirectBookDetails() {
  const { id } = useParams();
  return <Navigate to={`/books/${id}`} replace />;
}
function RedirectBookReader() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString();
  return <Navigate to={`/books/${id}/read${qs ? `?${qs}` : ''}`} replace />;
}
function BookReaderSwitcher() {
  const [searchParams] = useSearchParams();
  return searchParams.get('v') === '2' ? <BookReaderV2 /> : <BookReader />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomepageGuard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/dashboard/explore" element={<Navigate to="/explore" replace />} />
          <Route path="/dashboard/library" element={<Navigate to="/library" replace />} />
          <Route path="/dashboard/profile" element={<Navigate to="/profile" replace />} />
          <Route path="/dashboard/settings" element={<Navigate to="/settings" replace />} />
          <Route path="/dashboard/books/:id" element={<RedirectBookDetails />} />
          <Route path="/dashboard/books/:id/read" element={<RedirectBookReader />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/explore" element={<DashboardExplore />} />
            <Route path="/library" element={<DashboardLibrary />} />
            <Route path="/profile" element={<DashboardProfile />} />
            <Route path="/settings" element={<DashboardSettings />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/books/:id/read" element={<BookReaderSwitcher />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
