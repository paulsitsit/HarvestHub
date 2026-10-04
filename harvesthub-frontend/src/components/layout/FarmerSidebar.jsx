import {
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiPackage,
  FiStar,
  FiUser
} from 'react-icons/fi';

import {
  NavLink,
  useNavigate
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';

const FarmerSidebar = () => {
  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const links = [
    {
      label: 'Dashboard',
      path: '/farmer/dashboard',
      icon: FiHome
    },
    {
      label: 'My profile',
      path: '/farmer/profile',
      icon: FiUser
    },
    {
      label: 'My products',
      path: '/farmer/products',
      icon: FiPackage
    },
    {
      label: 'Inquiries',
      path: '/farmer/inquiries',
      icon: FiMessageSquare
    },
    {
      label: 'My reviews',
      path: '/farmer/reviews',
      icon: FiStar
    },
    {
      label: 'Payments',
      path: '/farmer/payments',
      icon: FiCreditCard
    }
  ];

  const linkClass = ({ isActive }) => [
    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition',
    isActive
      ? 'bg-[var(--green-700)] text-white shadow-md'
      : 'text-[var(--green-800)] hover:bg-[var(--green-100)]'
  ].join(' ');

  const handleLogout = () => {
    logout();

    navigate('/login', {
      replace: true
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col overflow-y-auto border-r border-[var(--green-100)] bg-[var(--surface)] shadow-[4px_0_24px_rgba(11,61,46,0.08)] lg:flex">
      <div className="border-b border-[var(--green-100)] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--green-100)]">
            <img
              src="/harvesthub-icon.png"
              alt="HarvestHub"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[var(--green-900)]">
              {user?.farmName ||
                user?.name ||
                'Farmer account'}
            </p>

            <p className="truncate text-xs text-[var(--muted)]">
              {user?.email || 'Farmer'}
            </p>
          </div>
        </div>
      </div>

      <nav
        className="flex-1 space-y-2 px-4 py-5"
        aria-label="Farmer navigation"
      >
        <p className="px-4 pb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
          Workspace
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              <Icon size={19} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[var(--green-100)] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
        >
          <FiLogOut size={19} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default FarmerSidebar;