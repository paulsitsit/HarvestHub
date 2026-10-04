import {
  FiBox,
  FiCreditCard,
  FiHome,
  FiMessageSquare,
  FiUser
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const FarmerBottomNav = () => {
  const links = [
    {
      label: 'Home',
      path: '/farmer/dashboard',
      icon: FiHome
    },
    {
      label: 'Products',
      path: '/farmer/products',
      icon: FiBox
    },
    {
      label: 'Inquiries',
      path: '/farmer/inquiries',
      icon: FiMessageSquare
    },
    {
      label: 'Fees',
      path: '/farmer/payments',
      icon: FiCreditCard
    },
    {
      label: 'Profile',
      path: '/farmer/profile',
      icon: FiUser
    }
  ];

  return (
    <nav
      aria-label="Mobile farmer navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/90 px-2 py-2 shadow-2xl backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => [
                'flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition',
                isActive
                  ? 'bg-[var(--green-100)] text-[var(--green-700)]'
                  : 'text-[var(--muted)]'
              ].join(' ')}
            >
              <Icon size={19} />
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default FarmerBottomNav;