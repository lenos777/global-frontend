import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16 md:pb-0">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default PublicLayout;