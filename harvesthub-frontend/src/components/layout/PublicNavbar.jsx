import { useState } from 'react';

import {
  FiLogIn,
  FiMenu,
  FiPhone,
  FiUser,
  FiX
} from 'react-icons/fi';

import {
  Link,
  NavLink
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';

const BRAND_ICON = '/harvesthub-icon.png';

const PublicNavbar = () => {
  const [
    open,
    setOpen
  ] = useState(false);

  const {
    isAuthenticated,
    isFarmer,
    isAdmin,
    user,
    logout
  } = useAuth();

  const navClass = ({ isActive }) => [
    'rounded-xl px-3 py-2 text-sm font-bold transition',
    isActive
      ? 'bg-[var(--green-100)] text-[var(--green-700)]'
      : 'text-[var(--text)] hover:bg-[var(--green-100)]'
  ].join(' ');

  const closeMenu = () => {
    setOpen(false);
  };

  const dashboardPath = isAdmin
    ? '/admin'
    : isFarmer
      ? '/farmer/dashboard'
      : '/';

  return (
    <header className="glass-navbar sticky top-0 z-40">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
          aria-label="HarvestHub home"
        >
          <img
            src={BRAND_ICON}
            alt="HarvestHub"
            width="52"
            height="52"
            className="h-12 w-12 shrink-0 rounded-2xl object-contain shadow-lg"
          />

          <span className="font-[Poppins] text-xl font-extrabold text-[var(--green-900)]">
            Harvest
            <span className="text-[var(--gold-600)]">
              Hub
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-2 lg:flex"
          aria-label="Primary navigation"
        >
          <NavLink
            to="/"
            end
            className={navClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={navClass}
          >
            Browse products
          </NavLink>

          <NavLink
            to="/about"
            className={navClass}
          >
            About
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/products"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[var(--green-700)] hover:bg-[var(--green-100)]"
          >
            <FiPhone size={17} />
            Find a farmer
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="green-button"
            >
              <FiLogIn size={17} />
              Farmer login
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link
                to={dashboardPath}
                className="gold-button"
              >
                <FiUser size={17} />
                {user?.name || 'Dashboard'}
              </Link>

              <button
                type="button"
                onClick={logout}
                className="green-button"
              >
                Log out
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen((value) => !value)
          }
          aria-label={
            open
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={open}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[var(--green-700)] hover:bg-[var(--green-100)] lg:hidden"
        >
          {open ? (
            <FiX size={24} />
          ) : (
            <FiMenu size={24} />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/50 px-5 py-4 lg:hidden">
          <nav
            className="flex flex-col gap-2"
            aria-label="Mobile navigation"
          >
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={navClass}
            >
              Browse products
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={navClass}
            >
              About
            </NavLink>

            <div className="mt-2 border-t border-white/50 pt-3">
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="green-button w-full"
                >
                  <FiLogIn size={17} />
                  Farmer login
                </Link>
              )}

              {isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="gold-button w-full"
                  >
                    <FiUser size={17} />
                    Open dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="green-button w-full"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;