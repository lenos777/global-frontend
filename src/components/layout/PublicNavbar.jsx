import { Link, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
  const location = useLocation();

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
              <img src="logo.png" width={'75px'}/>
              <div>
                <h1 className="text-3xl font-bold text-logo-blue">GLOBAL</h1>
                <p className="text-sm text-gray-600 font-medium">O'QUV MARKAZI</p>
              </div>
            </Link>
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
          </div>
        </div>
      </header>
  );
};

export default PublicNavbar;