// Centralized contact information configuration
export const CONTACT_INFO = {
  businessName: 'Auto Shop Demo',
  address: {
    street: '123 Main Street',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    formatted: '123 Main Street, Dallas, TX 75201'
  },
  phone: {
    display: '555-123-4567',
    href: 'tel:555-123-4567'
  },
  email: {
    display: 'info@autoshopdemo.com',
    href: 'mailto:info@autoshopdemo.com'
  },
  hours: {
    weekday: {
      days: 'Monday - Friday',
      hours: '8:00 AM - 6:00 PM'
    },
    saturday: {
      days: 'Saturday',
      hours: '9:00 AM - 4:00 PM'
    },
    sunday: {
      days: 'Sunday',
      hours: 'Closed'
    }
  },
  established: '1983'
};
