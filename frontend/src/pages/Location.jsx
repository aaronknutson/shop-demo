import { Helmet } from "react-helmet-async";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaDirections,
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

function Location() {
  const businessInfo = {
    name: CONTACT_INFO.businessName,
    address: CONTACT_INFO.address.street,
    city: CONTACT_INFO.address.city,
    state: CONTACT_INFO.address.state,
    zip: CONTACT_INFO.address.zip,
    phone: CONTACT_INFO.phone.display,
    email: CONTACT_INFO.email.display,
    coordinates: {
      lat: 32.7767,
      lng: -96.7970,
    },
  };

  const hours = [
    { day: CONTACT_INFO.hours.weekday.days, time: CONTACT_INFO.hours.weekday.hours },
    { day: CONTACT_INFO.hours.saturday.days, time: CONTACT_INFO.hours.saturday.hours },
    { day: CONTACT_INFO.hours.sunday.days, time: CONTACT_INFO.hours.sunday.hours },
  ];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${businessInfo.coordinates.lat},${businessInfo.coordinates.lng}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  }&q=${businessInfo.address},${businessInfo.city},${businessInfo.state}`;

  return (
    <>
      <Helmet>
        <title>Location & Hours - Auto Shop Demo Dallas</title>
        <meta
          name='description'
          content={`Visit Auto Shop Demo at ${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state}. View our hours and get directions.`}
        />
      </Helmet>

      {/* Page Header */}
      <section className='bg-gradient-primary text-white py-16'>
        <div className='container-custom text-center'>
          <h1 className='mb-4'>Visit Our Shop</h1>
          <p className='text-xl text-gray-100 max-w-3xl mx-auto'>
            Find us in Dallas and get directions to our auto repair facility
          </p>
        </div>
      </section>

      {/* Location Content */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Map */}
            <div>
              <h2 className='mb-6'>Find Us Here</h2>

              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <div className='rounded-card overflow-hidden shadow-card h-[400px] mb-6'>
                  <iframe
                    src={googleMapsEmbedUrl}
                    width='100%'
                    height='100%'
                    style={{ border: 0 }}
                    allowFullScreen=''
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    title='Auto Shop Demo Location Map'
                  />
                </div>
              ) : (
                <div className='card h-[400px] flex items-center justify-center bg-gray-100 mb-6'>
                  <div className='text-center'>
                    <FaMapMarkerAlt className='text-5xl text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>
                      {businessInfo.address}
                      <br />
                      {businessInfo.city}, {businessInfo.state}{" "}
                      {businessInfo.zip}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='btn btn-primary'>
                      <FaDirections />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}

              <a
                href={googleMapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary w-full'>
                <FaDirections />
                Get Directions
              </a>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className='mb-6'>Contact Information</h2>

              <div className='space-y-6'>
                {/* Address */}
                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaMapMarkerAlt className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Address</h3>
                      <p className='text-gray-700'>
                        {businessInfo.address}
                        <br />
                        {businessInfo.city}, {businessInfo.state}{" "}
                        {businessInfo.zip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaPhone className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Phone</h3>
                      <a
                        href={`tel:${businessInfo.phone}`}
                        className='text-primary hover:text-primary-dark font-medium text-lg'>
                        {businessInfo.phone}
                      </a>
                      <p className='text-sm text-gray-600 mt-1'>
                        Call us for appointments and quotes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaEnvelope className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Email</h3>
                      <a
                        href={`mailto:${businessInfo.email}`}
                        className='text-primary hover:text-primary-dark font-medium'>
                        {businessInfo.email}
                      </a>
                      <p className='text-sm text-gray-600 mt-1'>
                        Send us your questions or requests
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaClock className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold mb-3'>
                        Business Hours
                      </h3>
                      <div className='space-y-2'>
                        {hours.map((item, index) => (
                          <div
                            key={index}
                            className='flex justify-between items-center py-2 border-b border-gray-200 last:border-0'>
                            <span className='font-medium text-gray-700'>
                              {item.day}
                            </span>
                            <span className='text-gray-600'>{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parking & Directions Info */}
      <section className='section-padding bg-light'>
        <div className='container-custom'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-center mb-8'>Parking & Directions</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='card'>
                <h3 className='text-xl mb-4'>Parking</h3>
                <p className='text-gray-600'>
                  We have ample parking available in front of our facility. Free
                  parking for all customers during service appointments.
                </p>
              </div>
              <div className='card'>
                <h3 className='text-xl mb-4'>Drop-Off Service</h3>
                <p className='text-gray-600'>
                  Drop off your vehicle before or after business hours using our
                  secure key drop box. Call ahead to arrange.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Location;
