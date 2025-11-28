import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaPhone, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { getServiceBySlug } from '../data/services';
import { BreadcrumbSchema } from '../components/common/StructuredData';

function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  // If service not found, redirect to services page
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{service.title} - Auto Shop Demo Dallas</title>
        <meta name="description" content={service.fullDescription} />
        <meta property="og:title" content={`${service.title} - Auto Shop Demo`} />
        <meta property="og:description" content={service.shortDescription} />
      </Helmet>

      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://autoshopdemomotive.com' },
        { name: 'Services', url: 'https://autoshopdemomotive.com/services' },
        { name: service.title, url: `https://autoshopdemomotive.com/services/${service.slug}` }
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
            <span className="text-white">{service.title}</span>
          </nav>

          <h1 className="mb-4">{service.title}</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Service Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <h2 className="mb-6">About This Service</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="mb-6">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-accent text-xl mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-12">
                <h2 className="mb-6">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="card bg-primary-50">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {service.faqs.map((faq, index) => (
                      <div key={index} className="card">
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="card bg-gradient-primary text-white">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Need This Service?
                  </h3>
                  <p className="mb-6 text-gray-100">
                    Contact us today for a free quote or to schedule an appointment.
                  </p>
                  <div className="space-y-3">
                    <Link to="/quote" className="btn bg-white text-primary hover:bg-gray-100 w-full">
                      <FaCalendarAlt />
                      Request Quote
                    </Link>
                    <a
                      href="tel:555-123-4567"
                      className="btn btn-outline border-white text-white hover:bg-white hover:text-primary w-full"
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

                {/* Why Choose Us */}
                <div className="card bg-light">
                  <h3 className="text-xl font-semibold mb-4">Why Choose Us</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-accent mt-1 flex-shrink-0" />
                      <span>38 years of experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-accent mt-1 flex-shrink-0" />
                      <span>ASE-certified technicians</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-accent mt-1 flex-shrink-0" />
                      <span>Quality parts & workmanship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-accent mt-1 flex-shrink-0" />
                      <span>Honest, transparent pricing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services CTA */}
      <section className="section-padding bg-light">
        <div className="container-custom text-center">
          <h2 className="mb-6">Explore Our Other Services</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We offer a full range of auto repair and maintenance services
          </p>
          <Link to="/services" className="btn btn-primary btn-lg">
            View All Services
          </Link>
        </div>
      </section>
    </>
  );
}

export default ServiceDetail;
