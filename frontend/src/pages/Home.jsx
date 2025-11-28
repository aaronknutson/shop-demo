import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaCalendarAlt,
  FaWrench,
  FaClock,
  FaAward,
  FaThumbsUp,
} from "react-icons/fa";
import ReviewCarousel from "../components/common/ReviewCarousel";
import {
  LocalBusinessSchema,
  BreadcrumbSchema,
} from "../components/common/StructuredData";
import { CONTACT_INFO } from "../config/contact";

function Home() {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - parseInt(CONTACT_INFO.established);

  const services = [
    {
      icon: FaWrench,
      title: "General Repairs",
      description: "Expert diagnostics and repairs for all makes and models",
    },
    {
      icon: FaClock,
      title: "Quick Service",
      description: "Fast turnaround times without compromising quality",
    },
    {
      icon: FaAward,
      title: "Quality Parts",
      description: "Only the best parts and materials for your vehicle",
    },
    {
      icon: FaThumbsUp,
      title: "Trusted Service",
      description: `${yearsInBusiness} years of honest, reliable auto care in ${CONTACT_INFO.address.city}`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          {CONTACT_INFO.businessName} - {CONTACT_INFO.address.city} Auto Repair
          | Expert Car Service Since {CONTACT_INFO.established}
        </title>
        <meta
          name='description'
          content={`${CONTACT_INFO.businessName} offers expert auto repair in ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state}. Trusted since ${CONTACT_INFO.established} for quality service, honest pricing, and reliable car care.`}
        />
        <meta
          property='og:title'
          content={`${CONTACT_INFO.businessName} - ${CONTACT_INFO.address.city} Auto Repair Since ${CONTACT_INFO.established}`}
        />
        <meta
          property='og:description'
          content={`Expert auto repair services in ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state}. Quality service, honest pricing, and ${yearsInBusiness} years of experience.`}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://autoshopdemo.com' />
        <meta name='twitter:card' content='summary_large_image' />
      </Helmet>

      <LocalBusinessSchema />
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://autoshopdemo.com" }]}
      />

      {/* Hero Section */}
      <section className='bg-gradient-primary text-white section-padding'>
        <div className='container-custom'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 animate-fade-in'>
              {CONTACT_INFO.address.city} Auto Repair You Can Trust
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-gray-100'>
              Expert car care and honest service since{" "}
              {CONTACT_INFO.established}. Your reliable partner for all
              automotive needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link to='/quote' className='btn btn-secondary btn-lg'>
                <FaCalendarAlt />
                Get Free Quote
              </Link>
              <a
                href={CONTACT_INFO.phone.href}
                className='btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary'>
                <FaPhone />
                Call: {CONTACT_INFO.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className='section-padding bg-light'>
        <div className='container-custom'>
          <div className='text-center mb-12'>
            <h2 className='mb-4'>Why Choose Auto Shop Demo?</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              {yearsInBusiness} years of experience serving the Dallas community
              with quality auto repair services
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {services.map((service, index) => (
              <div key={index} className='card card-hover text-center'>
                <div className='flex justify-center mb-4'>
                  <service.icon className='text-5xl text-primary' />
                </div>
                <h3 className='text-xl mb-3'>{service.title}</h3>
                <p className='text-gray-600'>{service.description}</p>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link to='/services' className='btn btn-primary btn-lg'>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='text-center mb-12'>
            <h2 className='mb-4'>What Our Customers Say</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>
          <ReviewCarousel limit={6} />
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-padding bg-secondary text-white'>
        <div className='container-custom text-center'>
          <h2 className='mb-6 text-white'>Ready to Get Your Car Serviced?</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Contact us today for a free quote or to schedule your appointment
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/quote'
              className='btn bg-white text-secondary hover:bg-gray-100 btn-lg'>
              Request a Quote
            </Link>
            <Link
              to='/contact'
              className='btn btn-outline border-white text-white hover:bg-white hover:text-secondary btn-lg'>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
