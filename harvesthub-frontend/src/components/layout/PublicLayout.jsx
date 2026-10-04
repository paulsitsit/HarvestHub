import { Outlet } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground.jsx';
import PublicNavbar from './PublicNavbar.jsx';
import Footer from './Footer.jsx';

const PublicLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <PublicNavbar />

      <main className="relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;