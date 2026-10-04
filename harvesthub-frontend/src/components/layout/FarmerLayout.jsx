import {
  Link,
  Outlet
} from 'react-router-dom';

import {
  FiArrowLeft
} from 'react-icons/fi';

import BrandIcon from '../common/BrandIcon.jsx';
import FarmerSidebar from './FarmerSidebar.jsx';
import FarmerBottomNav from './FarmerBottomNav.jsx';
import AnimatedBackground from './AnimatedBackground.jsx';

const FarmerLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <header className="glass-navbar sticky top-0 z-30">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-5 lg:px-8">
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

          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--green-700)] hover:bg-[var(--green-100)]"
          >
            <FiArrowLeft />
            Marketplace
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-8 px-5 py-8 pb-28 lg:px-8 lg:pb-8">
        <FarmerSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerLayout;