import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardMobileHeader from './DashboardMobileHeader';

/**
 * DashboardLayout
 *
 * The persistent shell that wraps every dashboard page.
 * - Desktop: fixed sidebar on the left + scrollable content area on the right.
 * - Mobile:  top bar + slide-in drawer instead of sidebar.
 *
 * Child pages are rendered by <Outlet />.
 */
function DashboardLayout() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-neutral-50"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Desktop sidebar — hidden below lg */}
      <div className="hidden lg:flex lg:shrink-0">
        <DashboardSidebar />
      </div>

      {/* Right column: mobile header + scrollable page content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — hidden on lg and above */}
        <DashboardMobileHeader />

        {/* Scrollable main content */}
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto"
          aria-label="Dashboard content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
