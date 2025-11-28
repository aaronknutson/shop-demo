import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaChevronDown } from 'react-icons/fa';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated: isCustomerAuthenticated } = useCustomerAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // Determine portal link and text based on auth status
  const getPortalLink = () => {
    if (isAdminAuthenticated) {
      return { path: '/admin/dashboard', text: 'Admin Portal' };
    } else if (isCustomerAuthenticated) {
      return { path: '/portal/dashboard', text: 'Customer Portal' };
    } else {
      return { path: '/login', text: 'Login' };
    }
  };

  const portalLink = getPortalLink();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-base font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-3 px-4 text-lg font-medium transition-colors ${
      isActive ? 'text-primary bg-primary-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              Auto Shop Demo
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
                className={`flex items-center gap-1 text-base font-medium transition-colors ${
                  location.pathname.startsWith('/services') ||
                  location.pathname === '/brands' ||
                  location.pathname === '/tires' ||
                  location.pathname === '/tips'
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Services
                <FaChevronDown className={`text-xs transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link
                    to="/services"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    Repair Services
                  </Link>
                  <Link
                    to="/brands"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    Brands
                  </Link>
                  <Link
                    to="/tires"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    Tires
                  </Link>
                  <Link
                    to="/tips"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    Maintenance Tips
                  </Link>
                  <Link
                    to="/appointments"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors border-t border-gray-100 mt-1"
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/coupons" className={navLinkClass}>
              Coupons
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:555-123-4567"
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <FaPhone className="text-lg" />
              <span className="font-semibold">555-123-4567</span>
            </a>
            <Link
              to={portalLink.path}
              className="text-sm text-gray-700 hover:text-primary transition-colors"
            >
              {portalLink.text}
            </Link>
            <Link to="/quote" className="btn btn-primary">
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4">
            <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>
              About
            </NavLink>

            {/* Services Section */}
            <div className="py-2 px-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</p>
              <div className="space-y-1">
                <Link to="/services" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition-colors" onClick={closeMenu}>
                  Repair Services
                </Link>
                <Link to="/brands" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition-colors" onClick={closeMenu}>
                  Brands
                </Link>
                <Link to="/tires" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition-colors" onClick={closeMenu}>
                  Tires
                </Link>
                <Link to="/tips" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition-colors" onClick={closeMenu}>
                  Maintenance Tips
                </Link>
                <Link to="/appointments" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition-colors" onClick={closeMenu}>
                  Book Appointment
                </Link>
              </div>
            </div>

            <NavLink to="/coupons" className={mobileNavLinkClass} onClick={closeMenu}>
              Coupons
            </NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={closeMenu}>
              Contact
            </NavLink>
            <div className="mt-4 space-y-3 px-4">
              <a
                href="tel:555-123-4567"
                className="btn btn-outline w-full"
                onClick={closeMenu}
              >
                <FaPhone />
                Call: 555-123-4567
              </a>
              <Link
                to={portalLink.path}
                className="btn btn-outline w-full"
                onClick={closeMenu}
              >
                {portalLink.text}
              </Link>
              <Link
                to="/quote"
                className="btn btn-primary w-full"
                onClick={closeMenu}
              >
                Get Quote
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
