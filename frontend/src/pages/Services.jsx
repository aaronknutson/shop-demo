import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWrench,
  FaCar,
  FaOilCan,
  FaCogs,
  FaFan,
  FaBolt,
  FaTachometerAlt,
  FaTruck,
  FaRoad,
  FaClipboardCheck,
  FaArrowRight
} from 'react-icons/fa';
import servicesData from '../data/services';

// Icon mapping
const iconMap = {
  FaTachometerAlt,
  FaCar,
  FaTruck,
  FaRoad,
  FaOilCan,
  FaCogs,
  FaWrench,
  FaBolt,
  FaFan,
  FaClipboardCheck
};

function Services() {
  const services = servicesData.map(service => ({
    ...service,
    IconComponent: iconMap[service.icon] || FaWrench
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Auto Repair Services - Auto Shop Demo Dallas</title>
        <meta name="description" content="Complete auto repair services in Dallas, TX. From oil changes to engine repair, Auto Shop Demo handles it all with expert care." />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">Our Services</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Comprehensive auto repair services for all makes and models
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => {
              const Icon = service.IconComponent;
              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Link to={`/services/${service.slug}`} className="block">
                    <div className="card card-hover h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <Icon className="text-4xl text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{service.shortDescription}</p>
                      <ul className="space-y-2 mb-4">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-primary font-semibold mt-auto pt-4 border-t border-gray-200">
                        <span>Learn More</span>
                        <FaArrowRight className="text-sm" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-light">
        <div className="container-custom text-center">
          <h2 className="mb-6">Need Service for Your Vehicle?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule an appointment or get a free quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote" className="btn btn-primary btn-lg">
              Request a Quote
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
