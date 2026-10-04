import {
  FiBox,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiShield,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const AdminSidebar = ({
  mobile = false,
  onNavigate
}) => {
  const { logout } = useAuth();

  const links = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: FiHome
    },
    {
      label: 'Farmers',
      path: '/admin/farmers',
      icon: FiUsers
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: FiBox
    },
    {
      label: 'Payments',
      path: '/admin/payments',
      icon: FiCreditCard
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: FiShield
    },
    {
      label: 'Reviews',
      path: '/admin/reviews',
      icon: FiStar
    }
  ];

  return (
    <aside
      className={[
        'w-72 shrink-0',
        mobile ? 'block' : 'hidden lg:block'
      ].join(' ')}
    >
      <div
        className={[
          'glass-panel rounded-3xl p-4',
          mobile ? '' : 'sticky top-24'
        ].join(' ')}
      >
        <div className="border-b border-[var(--green-100)] px-3 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--green-900)] text-xl text-white">
              🛡️
            </div>

            <div>
              <p className="font-[Poppins] text-lg font-extrabold text-[var(--green-900)]">
                Admin panel
              </p>

              <p className="text-xs text-[var(--muted)]">
                HarvestHub control center
              </p>
            </div>
          </div>
        </div>

        <nav
          className="mt-4 space-y-1"
          aria-label="Admin navigation"
        >
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onNavigate}
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
            onClick={() => {
              logout();
              onNavigate?.();
            }}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
          >
            <FiLogOut size={19} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;