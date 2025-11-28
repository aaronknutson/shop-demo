import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaArrowRight } from 'react-icons/fa';
import vehicleBrandsData from '../data/vehicleBrands';
import { CONTACT_INFO } from '../config/contact';

function Brands() {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - parseInt(CONTACT_INFO.established);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        <title>Vehicle Brands We Service - Auto Shop Demo Dallas</title>
        <meta name="description" content="Expert repair and service for Buick, Chrysler, Dodge, Fiat, Jeep, and Ram Trucks. Specialized technicians for all makes and models in Dallas, TX." />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">Vehicle Brands We Service</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Specialized expertise for your vehicle's make and model
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Factory-Level Expertise Without Dealership Prices</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Auto Shop Demo, we specialize in servicing a wide range of vehicle brands.
              Our technicians receive ongoing training on the latest models and repair procedures,
              ensuring your vehicle gets the expert care it deserves at a fair price.
            </p>
            <p className="text-gray-600">
              Whether you drive a Buick, Chrysler, Dodge, Fiat, Jeep, or Ram truck,
              we have the tools, knowledge, and experience to keep it running strong.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {vehicleBrandsData.map((brand) => (
              <motion.div
                key={brand.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link to={`/${brand.slug}`} className="block h-full">
                  <div className="card card-hover h-full flex flex-col">
                    {/* Brand Icon */}
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full">
                        <FaCar className="text-4xl text-primary" />
                      </div>
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-2xl font-bold mb-3 text-center hover:text-primary transition-colors">
                      {brand.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-gray-600 mb-4 text-center flex-grow">
                      {brand.tagline}
                    </p>

                    {/* Popular Models */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Popular Models:</p>
                      <div className="flex flex-wrap gap-2">
                        {brand.popularModels.slice(0, 4).map((model, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold pt-4 border-t border-gray-200">
                      <span>Learn More</span>
                      <FaArrowRight className="text-sm" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Makes & Models */}
      <section className="section-padding bg-gradient-secondary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-white">We Service All Makes & Models</h2>
            <p className="text-xl text-gray-100 mb-8">
              Don't see your vehicle brand listed? No problem! We service all domestic and
              import vehicles with the same level of expertise and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services" className="btn bg-white text-secondary hover:bg-gray-100 btn-lg">
                View All Services
              </Link>
              <Link to="/quote" className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary btn-lg">
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Why Choose Auto Shop Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                <span className="text-2xl font-bold text-primary">{yearsInBusiness}+</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Years Experience</h3>
              <p className="text-gray-600">Serving {CONTACT_INFO.address.city} since {CONTACT_INFO.established}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                <span className="text-2xl font-bold text-primary">100%</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfaction</h3>
              <p className="text-gray-600">Quality work guaranteed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                <span className="text-2xl font-bold text-primary">ASE</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Certified</h3>
              <p className="text-gray-600">Expert technicians</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                <span className="text-2xl font-bold text-primary">$$$</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Honest, transparent quotes</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Brands;
