import {
  FiBarChart2,
  FiBox,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiMessageSquare,
  FiPlusCircle,
  FiStar,
  FiUser
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const FarmerSidebar = () => {
  const {
    user,
    farmerProfile,
    logout
  } = useAuth();

  const links = [
    {
      label: 'Dashboard',
      path: '/farmer/dashboard',
      icon: FiHome
    },
    {
      label: 'My products',
      path: '/farmer/products',
      icon: FiBox
    },
    {
      label: 'Add product',
      path: '/farmer/products/add',
      icon: FiPlusCircle
    },
    {
      label: 'Received inquiries',
      path: '/farmer/inquiries',
      icon: FiMessageSquare
    },
    {
      label: 'My reviews',
      path: '/farmer/reviews',
      icon: FiStar
    },
    {
      label: 'Listing fees',
      path: '/farmer/payments',
      icon: FiCreditCard
    },
    {
      label: 'Farm profile',
      path: '/farmer/profile',
      icon: FiUser
    }
  ];

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="glass-panel sticky top-24 rounded-3xl p-4">
        <div className="border-b border-[var(--green-100)] px-3 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--green-100)] text-xl">
              🌾
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[var(--green-900)]">
                {farmerProfile?.farmName || 'My farm'}
              </p>

              <p className="truncate text-xs text-[var(--muted)]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav
          className="mt-4 space-y-1"
          aria-label="Farmer navigation"
        >
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => [
                  'flex min-h-[46px] items-center gap-3 rounded-xl px-3 text-sm font-bold transition',
                  isActive
                    ? 'bg-[var(--green-700)] text-white shadow-lg'
                    : 'text-[var(--muted)] hover:bg-[var(--green-100)] hover:text-[var(--green-900)]'
                ].join(' ')}
              >
                <Icon size={19} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-[var(--green-100)] pt-4">
          <button
            type="button"
            onClick={logout}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
          >
            <FiFileText size={19} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FarmerSidebar;