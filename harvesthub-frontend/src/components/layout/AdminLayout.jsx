import { useState } from 'react';
import {
  FiArrowLeft,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AnimatedBackground from './AnimatedBackground.jsx';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <header className="glass-navbar sticky top-0 z-40">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileOpen((current) => !current)
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
              className="font-[Poppins] text-xl font-extrabold text-[var(--green-900)]"
            >
              Harvest<span className="text-[var(--gold-600)]">
                Hub
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

      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--green-900)]/35"
          />

          <div className="absolute left-0 top-[72px] h-[calc(100vh-72px)] w-[min(88vw,20rem)] overflow-y-auto bg-[var(--surface)] p-4 shadow-2xl">
            <AdminSidebar
              mobile
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1600px] gap-8 px-5 py-8 lg:px-8">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;