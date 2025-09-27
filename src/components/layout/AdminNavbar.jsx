import { Link } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';

const AdminNavbar = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <nav className='bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              className='lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
            >
              <Menu className='h-6 w-6' />
            </button>
            
            {/* Logo */}
            <div className='flex items-center ml-4 lg:ml-0'>
              <Link to='/admin' className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>G</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-lg font-bold text-primary-700'>GLOBAL</span>
                  <span className='text-xs text-gray-600'>Admin Panel</span>
                </div>
              </Link>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <Link
              to='/'
              className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Asosiy saytga qaytish
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;