import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [isNavigating, setIsNavigating] = useState(false);

  // Update active nav item based on current route
  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname === '/') {
      setActiveNavItem('home');
    } else if (pathname === '/test-results' || pathname.startsWith('/test-results/')) {
      setActiveNavItem('results');
    } else if (pathname === '/achievements' || pathname.startsWith('/achievements/')) {
      setActiveNavItem('achievements');
    } else if (pathname === '/graduates' || pathname.startsWith('/graduates/')) {
      setActiveNavItem('students');
    } else {
      // Default to home for unknown routes
      setActiveNavItem('home');
    }
    
    // Reset navigation state when route changes
    setIsNavigating(false);
  }, [location.pathname]);

  const handleBottomNavClick = useCallback((navType) => {
    // Prevent multiple rapid clicks
    if (isNavigating) return;
    
    // Get the target route
    let targetRoute;
    switch (navType) {
      case 'home':
        targetRoute = '/';
        break;
      case 'results':
        targetRoute = '/test-results';
        break;
      case 'achievements':
        targetRoute = '/achievements';
        break;
      case 'students':
        targetRoute = '/graduates';
        break;
      default:
        return;
    }
    
    // If we're already on the target route, don't navigate again
    if (location.pathname === targetRoute) {
      // For home page, scroll to top if already there
      if (navType === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Set navigation state and optimistically update UI
    setIsNavigating(true);
    setActiveNavItem(navType);
    
    // Navigate to the target route
    navigate(targetRoute);
  }, [navigate, location.pathname, isNavigating]);

  return (
    <>
      {/* Custom Styles for Mobile Navigation */}
      <style jsx>{`
        .logo-blue { color: #1a365d; }
        .bg-logo-blue { background-color: #1a365d; }
        .bg-logo-blue-10 { background-color: rgba(26, 54, 93, 0.1); }
        .text-logo-blue { color: #1a365d; }
        .hover\\:text-logo-blue:hover { color: #1a365d; }
        .hover\\:bg-logo-blue-10:hover { background-color: rgba(26, 54, 93, 0.1); }
      `}</style>

      {/* Font Awesome for Mobile Navigation */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 py-1">
          <button
            onClick={() => handleBottomNavClick('home')}
            disabled={isNavigating}
            className={`flex flex-col items-center py-2 px-1 transition-all duration-200 ${
              activeNavItem === 'home' ? 'text-logo-blue' : 'text-gray-500'
            } hover:text-logo-blue disabled:opacity-50`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
              activeNavItem === 'home' ? 'bg-logo-blue-10' : 'bg-gray-100 hover:bg-logo-blue-10'
            }`}>
              {isNavigating && activeNavItem === 'home' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-logo-blue border-t-transparent"></div>
              ) : (
                <i className={`fas fa-home text-sm ${activeNavItem === 'home' ? 'text-logo-blue' : ''}`}></i>
              )}
            </div>
            <span className={`text-xs font-medium ${activeNavItem === 'home' ? 'text-logo-blue' : ''}`}>
              Asosiy
            </span>
          </button>

          <button
            onClick={() => handleBottomNavClick('results')}
            disabled={isNavigating}
            className={`flex flex-col items-center py-2 px-1 transition-all duration-200 ${
              activeNavItem === 'results' ? 'text-logo-blue' : 'text-gray-500'
            } hover:text-logo-blue disabled:opacity-50`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
              activeNavItem === 'results' ? 'bg-logo-blue-10' : 'bg-gray-100 hover:bg-logo-blue-10'
            }`}>
              {isNavigating && activeNavItem === 'results' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-logo-blue border-t-transparent"></div>
              ) : (
                <i className={`fas fa-chart-line text-sm ${activeNavItem === 'results' ? 'text-logo-blue' : ''}`}></i>
              )}
            </div>
            <span className={`text-xs font-medium ${activeNavItem === 'results' ? 'text-logo-blue' : ''}`}>
              Test natijalari
            </span>
          </button>

          <button
            onClick={() => handleBottomNavClick('achievements')}
            disabled={isNavigating}
            className={`flex flex-col items-center py-2 px-1 transition-all duration-200 ${
              activeNavItem === 'achievements' ? 'text-logo-blue' : 'text-gray-500'
            } hover:text-logo-blue disabled:opacity-50`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
              activeNavItem === 'achievements' ? 'bg-logo-blue-10' : 'bg-gray-100 hover:bg-logo-blue-10'
            }`}>
              {isNavigating && activeNavItem === 'achievements' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-logo-blue border-t-transparent"></div>
              ) : (
                <i className={`fas fa-trophy text-sm ${activeNavItem === 'achievements' ? 'text-logo-blue' : ''}`}></i>
              )}
            </div>
            <span className={`text-xs font-medium ${activeNavItem === 'achievements' ? 'text-logo-blue' : ''}`}>
              Yutuqlar
            </span>
          </button>

          <button
            onClick={() => handleBottomNavClick('students')}
            disabled={isNavigating}
            className={`flex flex-col items-center py-2 px-1 transition-all duration-200 ${
              activeNavItem === 'students' ? 'text-logo-blue' : 'text-gray-500'
            } hover:text-logo-blue disabled:opacity-50`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
              activeNavItem === 'students' ? 'bg-logo-blue-10' : 'bg-gray-100 hover:bg-logo-blue-10'
            }`}>
              {isNavigating && activeNavItem === 'students' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-logo-blue border-t-transparent"></div>
              ) : (
                <i className={`fas fa-user-graduate text-sm ${activeNavItem === 'students' ? 'text-logo-blue' : ''}`}></i>
              )}
            </div>
            <span className={`text-xs font-medium ${activeNavItem === 'students' ? 'text-logo-blue' : ''}`}>
              Talabalarimiz
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;