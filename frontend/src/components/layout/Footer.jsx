import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { CONTACT_INFO } from "../../config/contact";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-dark text-white'>
      <div className='container-custom py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div>
            <h3 className='text-2xl font-heading font-bold text-white mb-4'>
              {CONTACT_INFO.businessName}
            </h3>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Serving {CONTACT_INFO.address.city} with quality auto repair services since {CONTACT_INFO.established}. Your
              trusted partner for honest, reliable car care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/about'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/services'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to='/brands'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  to='/tips'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Maintenance Tips
                </Link>
              </li>
              <li>
                <Link
                  to='/coupons'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Coupons
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to='/quote'
                  className='text-gray-300 hover:text-primary transition-colors'>
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <FaMapMarkerAlt className='text-primary mt-1 flex-shrink-0' />
                <span className='text-gray-300 text-sm'>
                  {CONTACT_INFO.address.street}
                  <br />
                  {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <FaPhone className='text-primary flex-shrink-0' />
                <a
                  href={CONTACT_INFO.phone.href}
                  className='text-gray-300 hover:text-primary transition-colors'>
                  {CONTACT_INFO.phone.display}
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <FaEnvelope className='text-primary flex-shrink-0' />
                <a
                  href={CONTACT_INFO.email.href}
                  className='text-gray-300 hover:text-primary transition-colors'>
                  {CONTACT_INFO.email.display}
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Business Hours</h4>
            <ul className='space-y-2'>
              <li className='flex items-start gap-3'>
                <FaClock className='text-primary mt-1 flex-shrink-0' />
                <div className='text-gray-300 text-sm'>
                  <div className='font-semibold'>{CONTACT_INFO.hours.weekday.days}</div>
                  <div>{CONTACT_INFO.hours.weekday.hours}</div>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <FaClock className='text-primary mt-1 flex-shrink-0' />
                <div className='text-gray-300 text-sm'>
                  <div className='font-semibold'>{CONTACT_INFO.hours.saturday.days}</div>
                  <div>{CONTACT_INFO.hours.saturday.hours}</div>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <FaClock className='text-primary mt-1 flex-shrink-0' />
                <div className='text-gray-300 text-sm'>
                  <div className='font-semibold'>{CONTACT_INFO.hours.sunday.days}</div>
                  <div>{CONTACT_INFO.hours.sunday.hours}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-gray-700 text-center'>
          <p className='text-gray-400 text-sm'>
            &copy; {currentYear} {CONTACT_INFO.businessName}. All rights reserved. | Serving
            {' '}{CONTACT_INFO.address.city} since {CONTACT_INFO.established}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
