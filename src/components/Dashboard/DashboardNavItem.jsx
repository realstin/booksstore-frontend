import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * A single sidebar navigation link.
 * Uses NavLink so the `isActive` class is applied automatically.
 */
function DashboardNavItem({ to, icon: Icon, label, onClick, end = false, collapsed = false }) {
  return (
    <div className="group relative">
      <NavLink
        to={to}
        end={end}
        onClick={onClick}
        aria-current={undefined} /* NavLink sets aria-current="page" automatically */
        aria-label={collapsed ? label : undefined}
        className={({ isActive }) =>
          [
            'group flex items-center rounded-xl py-2.5 text-[14px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
            collapsed ? 'justify-center px-2' : 'gap-3 px-3',
            isActive
              ? 'bg-neutral-950 text-white'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950',
          ].join(' ')
        }
      >
        {({ isActive }) => (
          <>
            <motion.span
              whileHover={{ scale: isActive ? 1 : 1.1 }}
              transition={{ duration: 0.18 }}
              className="shrink-0"
              aria-hidden="true"
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.9} />
            </motion.span>
            {!collapsed && <span>{label}</span>}
          </>
        )}
      </NavLink>

      {collapsed && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default DashboardNavItem;
