import {
  FiBarChart2,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiPackage,
  FiStar,
  FiUsers,
  FiX
} from 'react-icons/fi';

import {
  NavLink,
  useNavigate
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';

const AdminSidebar = ({
  mobile = false,
  onNavigate = () => {}
}) => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();

  const links = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: FiHome,
      end: true
    },
    {
      label: 'Farmers',
      path: '/admin/farmers',
      icon: FiUsers
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: FiPackage
    },
    {
      label: 'Payments',
      path: '/admin/payments',
      icon: FiCreditCard
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: FiUsers
    },
    {
      label: 'Reviews',
      path: '/admin/reviews',
      icon: FiStar
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
    onNavigate();
  };

  return (
    <aside
      className={[
        mobile
          ? 'relative flex h-full w-full flex-col'
          : 'fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-[var(--green-100)] bg-[var(--surface)] lg:flex',
        'overflow-y-auto',
        'bg-[var(--surface)]',
        'shadow-[4px_0_24px_rgba(11,61,46,0.08)]'
      ].join(' ')}
    >
      <div className="border-b border-[var(--green-100)] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
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
                  'HarvestHub Admin'}
              </p>

              <p className="truncate text-xs text-[var(--muted)]">
                {user?.email || 'Administrator'}
              </p>
            </div>
          </div>

          {mobile && (
            <button
              type="button"
              onClick={onNavigate}
              aria-label="Close sidebar"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--green-700)] hover:bg-[var(--green-100)]"
            >
              <FiX size={21} />
            </button>
          )}
        </div>
      </div>

      <nav
        className="flex-1 space-y-2 px-4 py-5"
        aria-label="Admin navigation"
      >
        <p className="px-4 pb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
          Management
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={onNavigate}
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

export default AdminSidebar;