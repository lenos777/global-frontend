import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Award, 
  GraduationCap, 
  X,
  Users,
  FileText
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Bosh sahifa',
      icon: Home,
      path: '/admin',
      exact: true
    },
    {
      name: 'Fanlar',
      icon: BookOpen,
      path: '/admin/subjects'
    },
    {
      name: 'Yutuqlar',
      icon: Award,
      path: '/admin/achievements'
    },
    {
      name: 'Talabalar',
      icon: GraduationCap,
      path: '/admin/graduates'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className='lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75' 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:h-full lg:w-64 lg:flex-shrink-0
      `}>
        <div className='flex flex-col h-full'>
          {/* Close button for mobile */}
          <div className='lg:hidden flex justify-end p-4'>
            <button
              onClick={onClose}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            >
              <X className='h-6 w-6' />
            </button>
          </div>
          
          {/* Sidebar Header */}
          <div className='hidden lg:block px-4 py-6 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-800'>Admin Panel</h2>
            <p className='text-sm text-gray-500'>Boshqaruv paneli</p>
          </div>
          
          {/* Navigation */}
          <nav className='flex-1 px-4 pb-4 pt-4 space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${active 
                      ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;