import { useState } from 'react';

import {
  FiArrowLeft,
  FiMenu,
  FiX
} from 'react-icons/fi';

import {
  Link,
  Outlet
} from 'react-router-dom';

import BrandIcon from '../common/BrandIcon.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import AnimatedBackground from './AnimatedBackground.jsx';

const AdminLayout = () => {
  const [
    mobileOpen,
    setMobileOpen
  ] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />

      <AdminSidebar />

      <header className="glass-navbar sticky top-0 z-40 lg:ml-72">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              aria-label={
                mobileOpen
                  ? 'Close admin menu'
                  : 'Open admin menu'
              }
              aria-expanded={mobileOpen}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[var(--green-700)] hover:bg-[var(--green-100)] lg:hidden"
            >
              {mobileOpen ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={24} />
              )}
            </button>

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <BrandIcon size="sm" />

              <span className="font-[Poppins] text-xl font-extrabold text-[var(--green-900)]">
                Harvest
                <span className="text-[var(--gold-600)]">
                  Hub
                </span>
              </span>
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--green-700)] hover:bg-[var(--green-100)]"
          >
            <FiArrowLeft />
            Marketplace
          </Link>
        </div>
      </header>

      <div className="lg:hidden">
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={closeMobileMenu}
              className="absolute inset-0 h-full w-full bg-[var(--green-900)]/40"
            />

            <div className="absolute left-0 top-0 h-full w-[min(88vw,20rem)]">
              <AdminSidebar
                mobile
                onNavigate={closeMobileMenu}
              />
            </div>
          </div>
        )}
      </div>

      <main className="min-h-[calc(100vh-72px)] lg:ml-72">
        <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;