import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from './Dashboard/DashboardLayout';
import { LibraryProvider } from '../context/LibraryContext';
import logo from '../assets/bookstorelogo.svg';

/**
 * BookPageLayout
 *
 * Frame for pages that anyone may view, but that look different depending
 * on whether the visitor has an account.
 *
 *   - Session check still running -> loader (avoids flashing the wrong frame).
 *   - Logged in                   -> the normal DashboardLayout (sidebar,
 *                                    shared library). Nothing changes for them.
 *   - Guest                       -> a simple public header. LibraryProvider is
 *                                    still mounted so child pages can call
 *                                    useLibrary(); it makes no network request
 *                                    for guests (libStatus is 'guest').
 *
 * Unlike ProtectedRoute, a guest is never redirected to /login here.
 * Child pages are rendered through <Outlet />.
 */
function BookPageLayout() {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"
          aria-label="Loading…"
        />
      </div>
    );
  }

  if (user) {
    return <DashboardLayout />;
  }

  return (
    <LibraryProvider>
      <div
        className="min-h-screen bg-neutral-50"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <header className="border-b border-neutral-100 bg-white">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-16">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              aria-label="BookStore — go to homepage"
            >
              <img src={logo} alt="" className="h-6 w-6" aria-hidden="true" />
              <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
                BookStore
              </span>
            </Link>

            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-10 items-center rounded-full bg-neutral-900 px-6 text-[14px] font-semibold text-white transition hover:bg-black"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main aria-label="Book content">
          <Outlet />
        </main>
      </div>
    </LibraryProvider>
  );
}

export default BookPageLayout;