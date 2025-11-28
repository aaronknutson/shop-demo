import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPhone, FaCalendarAlt, FaChevronRight, FaCar } from 'react-icons/fa';
import { getBrandBySlug } from '../data/vehicleBrands';
import { BreadcrumbSchema } from '../components/common/StructuredData';

function BrandDetail() {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);

  // If brand not found, redirect to services page
  if (!brand) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{brand.name} Repair Dallas - {brand.tagline}</title>
        <meta name="description" content={brand.description} />
        <meta property="og:title" content={`${brand.name} Repair - Auto Shop Demo Dallas`} />
        <meta property="og:description" content={brand.tagline} />
      </Helmet>

      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://autoshopdemomotive.com' },
        { name: 'Services', url: 'https://autoshopdemomotive.com/services' },
        { name: `${brand.name} Repair`, url: `https://autoshopdemomotive.com/${brand.slug}` }
      ]} />

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-sm mb-4 text-gray-200">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-xs" />
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <FaChevronRight className="text-xs" />
            <span className="text-white">{brand.name} Repair</span>
          </nav>

          <h1 className="mb-4">{brand.tagline}</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Expert {brand.name} service and repair in Dallas, TX
          </p>
        </div>
      </section>

      {/* Brand Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <h2 className="mb-6">About Our {brand.name} Service</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {brand.description}
                </p>
                <p className="text-gray-700">
                  At Auto Shop Demo, we pride ourselves on providing dealership-quality service at independent shop prices. Our technicians stay up-to-date with the latest {brand.name} technical bulletins and service procedures to ensure your vehicle receives the best care possible.
                </p>
              </div>

              {/* Popular Models */}
              <div className="mb-12">
                <h2 className="mb-6">Popular {brand.name} Models We Service</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {brand.popularModels.map((model, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card bg-primary-50 text-center"
                    >
                      <FaCar className="text-3xl text-primary mx-auto mb-2" />
                      <p className="font-semibold text-gray-800">{brand.name} {model}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Common Services */}
              <div className="mb-12">
                <h2 className="mb-6">Common {brand.name} Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brand.commonServices.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-accent text-xl mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="mb-12">
                <h2 className="mb-6">Why Choose Us for Your {brand.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brand.whyChooseUs.map((reason, index) => (
                    <div key={index} className="card bg-light">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Promise */}
              <div className="card bg-primary text-white">
                <h3 className="text-2xl font-bold mb-4 text-white">Our Promise to {brand.name} Owners</h3>
                <p className="mb-4 text-gray-100">
                  We understand that your {brand.name} is more than just transportation - it's an investment. That's why we treat every vehicle as if it were our own, using quality parts, proven procedures, and honest communication throughout the service process.
                </p>
                <p className="text-gray-100">
                  Whether you need routine maintenance or major repairs, you can trust Auto Shop Demo to provide expert care for your {brand.name} at a fair price.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="card bg-gradient-secondary text-white">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Need {brand.name} Service?
                  </h3>
                  <p className="mb-6 text-gray-100">
                    Get expert service for your {brand.name} today. Request a quote or call us now!
                  </p>
                  <div className="space-y-3">
                    <Link to="/quote" className="btn bg-white text-secondary hover:bg-gray-100 w-full">
                      <FaCalendarAlt />
                      Request Quote
                    </Link>
                    <a
                      href="tel:555-123-4567"
                      className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary w-full"
                    >
                      <FaPhone />
                      Call: 555-123-4567
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-gray-600">8AM - 6PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">9AM - 4PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="card bg-light">
                  <h3 className="text-xl font-semibold mb-4">Location</h3>
                  <p className="text-gray-700 mb-3">
                    1818 Storey Ln #100<br />
                    Dallas, TX 75220
                  </p>
                  <Link to="/location" className="text-primary font-semibold hover:text-primary-dark">
                    Get Directions →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Brands CTA */}
      <section className="section-padding bg-light">
        <div className="container-custom text-center">
          <h2 className="mb-6">We Service All Makes & Models</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            No matter what vehicle you drive, we have the expertise to keep it running strong
          </p>
          <Link to="/services" className="btn btn-primary btn-lg">
            View All Services
          </Link>
        </div>
      </section>
    </>
  );
}

export default BrandDetail;
