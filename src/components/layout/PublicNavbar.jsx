import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const PublicNavbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Asosiy', path: '/', type: 'route' },
    { name: 'Test natijalari', path: '/test-results', type: 'route' },
    { name: 'Yutuqlar', path: '/achievements', type: 'route' },
    { name: 'Talabalarimiz', path: '/graduates', type: 'route' },
  ];

  const isActive = (path, type) => {
    if (type === 'route') {
      return location.pathname === path;
    }
    return false;
  };

  const handleNavClick = (e, path, type) => {
    if (type === 'scroll') {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
     <header className="bg-white shadow-lg" style={{border: '1px solid rgba(26, 54, 93, 0.1)'}}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-logo-blue to-logo-blue-light rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">G</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-logo-blue tracking-wide">GLOBAL</h1>
                <p className="text-sm text-gray-600 font-medium tracking-wider">O'QUV MARKAZI</p>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                item.type === 'route' ? (
                  <Link
                    key={index}
                    to={item.path}
                    className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                      isActive(item.path, item.type)
                        ? 'text-logo-blue bg-logo-blue-10'
                        : 'text-gray-700 hover:text-logo-blue hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path, item.type)}
                    className="text-gray-700 hover:text-logo-blue transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2 pt-4">
                {navItems.map((item, index) => (
                  item.type === 'route' ? (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`transition-colors font-medium px-3 py-3 rounded-lg ${
                        isActive(item.path, item.type)
                          ? 'text-logo-blue bg-logo-blue-10'
                          : 'text-gray-700 hover:text-logo-blue hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={index}
                      href={item.path}
                      onClick={(e) => {
                        handleNavClick(e, item.path, item.type);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-logo-blue transition-colors font-medium px-3 py-3 rounded-lg hover:bg-gray-100"
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
  );
};

export default PublicNavbar;