import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  FaHome,
  FaCar,
  FaCalendarAlt,
  FaHistory,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';

function CustomerPortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { customer, logout } = useCustomerAuth();

  const navigation = [
    { name: 'Dashboard', path: '/portal/dashboard', icon: FaHome },
    { name: 'My Vehicles', path: '/portal/vehicles', icon: FaCar },
    { name: 'Appointments', path: '/portal/appointments', icon: FaCalendarAlt },
    { name: 'Service History', path: '/portal/service-history', icon: FaHistory },
    { name: 'Profile', path: '/portal/profile', icon: FaUser },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <Link to="/portal/dashboard" className="ml-4 lg:ml-0 flex items-center">
                <span className="text-xl font-bold text-primary">Customer Portal</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <FaUser className="text-primary" />
                <span className="font-medium">{customer?.firstName} {customer?.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            mt-16 lg:mt-0
          `}
        >
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }
                  `}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <span>Back to Website</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerPortalLayout;
