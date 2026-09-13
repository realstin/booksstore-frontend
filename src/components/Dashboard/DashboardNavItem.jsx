import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * A single sidebar navigation link.
 * Uses NavLink so the `isActive` class is applied automatically.
 */
function DashboardNavItem({ to, icon: Icon, label, onClick, end = false, collapsed = false }) {
  return (
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
  );
}

export default DashboardNavItem;
