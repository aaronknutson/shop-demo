import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaCar, FaTools, FaShieldAlt, FaDollarSign } from 'react-icons/fa';

function Tires() {
  const tireServices = [
    {
      icon: FaCar,
      title: 'New Tire Sales',
      description: 'Wide selection of quality tires from top brands including Michelin, Goodyear, Bridgestone, and more.',
      features: ['All major brands', 'Competitive pricing', 'Expert recommendations', 'Same-day installation']
    },
    {
      icon: FaTools,
      title: 'Tire Installation',
      description: 'Professional tire mounting and balancing to ensure a smooth, safe ride.',
      features: ['Precision mounting', 'Computer balancing', 'Valve stem replacement', 'Wheel alignment check']
    },
    {
      icon: FaShieldAlt,
      title: 'Tire Repair',
      description: 'Quick and reliable tire repair services to get you back on the road safely.',
      features: ['Puncture repair', 'Leak detection', 'Patch and plug', 'TPMS service']
    },
    {
      icon: FaDollarSign,
      title: 'Tire Rotation',
      description: 'Regular tire rotation to extend tire life and maintain even tread wear.',
      features: ['Extended tire life', 'Better fuel economy', 'Improved handling', 'Even tread wear']
    }
  ];

  const tireBrands = [
    'Michelin',
    'Goodyear',
    'Bridgestone',
    'Continental',
    'Pirelli',
    'Yokohama',
    'BFGoodrich',
    'Firestone',
    'Hankook',
    'Cooper',
    'Dunlop',
    'Toyo'
  ];

  const tireTypes = [
    {
      name: 'All-Season Tires',
      description: 'Versatile tires designed for year-round performance in various weather conditions.',
      ideal: 'Daily driving, moderate climates'
    },
    {
      name: 'Performance Tires',
      description: 'Enhanced grip and handling for sports cars and performance vehicles.',
      ideal: 'Sports cars, high-performance driving'
    },
    {
      name: 'Winter Tires',
      description: 'Specialized tread patterns and rubber compounds for optimal traction in snow and ice.',
      ideal: 'Cold climates, winter weather'
    },
    {
      name: 'Truck & SUV Tires',
      description: 'Heavy-duty tires built for larger vehicles with increased load capacity.',
      ideal: 'Trucks, SUVs, crossovers'
    },
    {
      name: 'All-Terrain Tires',
      description: 'Rugged tires designed for both on-road comfort and off-road capability.',
      ideal: 'Off-roading, mixed terrain'
    },
    {
      name: 'Eco-Friendly Tires',
      description: 'Low rolling resistance tires designed to improve fuel efficiency.',
      ideal: 'Fuel economy, reduced emissions'
    }
  ];

  const whyChooseUs = [
    'Expert tire fitting and balancing',
    'Competitive prices on all major brands',
    'Free tire pressure check',
    'Professional installation',
    'Warranty on tire services',
    'TPMS service and calibration'
  ];

  return (
    <>
      <Helmet>
        <title>Tire Services Dallas | New Tires, Installation & Repair - Auto Shop Demo</title>
        <meta name="description" content="Complete tire services in Dallas, TX. New tire sales, installation, repair, and rotation. Top brands at competitive prices. Call Auto Shop Demo today!" />
        <meta name="keywords" content="tires Dallas, tire installation, tire repair, tire rotation, new tires, tire service Dallas" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Professional Tire Services in Dallas
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              From new tire sales to expert installation and repair, we've got you covered with quality tires and professional service.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/appointments" className="btn bg-white text-primary hover:bg-gray-100">
                Schedule Service
              </Link>
              <Link to="/quote" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tire Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Our Tire Services
            </h2>
            <p className="text-lg text-gray-600">
              Complete tire solutions for all makes and models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tireServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="text-3xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tire Types */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Types of Tires We Offer
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect tires for your vehicle and driving needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tireTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-3">{type.description}</p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Ideal for:</p>
                  <p className="text-sm font-medium text-primary">{type.ideal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tire Brands */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Top Tire Brands Available
            </h2>
            <p className="text-lg text-gray-600">
              We carry all major tire brands to fit your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tireBrands.map((brand, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-primary-50 hover:shadow-md transition-all"
              >
                <p className="font-semibold text-gray-900">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Why Choose Auto Shop Demo for Tires?
              </h2>
              <p className="text-lg text-gray-600">
                Professional service, quality products, and competitive pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseUs.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 text-center">
              Tire Service FAQs
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">How often should I replace my tires?</h3>
                <p className="text-gray-600">
                  Most tires should be replaced every 6 years or 50,000-70,000 miles, whichever comes first. However, this can vary based on driving habits, road conditions, and tire type. We recommend regular tire inspections to check tread depth and overall condition.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">How often should I rotate my tires?</h3>
                <p className="text-gray-600">
                  We recommend rotating your tires every 5,000 to 7,500 miles or during every other oil change. Regular rotation helps ensure even tread wear and extends the life of your tires.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can you repair a tire with a puncture?</h3>
                <p className="text-gray-600">
                  In many cases, yes. We can repair most punctures that are less than 1/4 inch in diameter and located in the tread area. Punctures in the sidewall or shoulder typically require tire replacement for safety reasons.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer tire warranties?</h3>
                <p className="text-gray-600">
                  Yes! We offer warranties on both tire products and installation services. Warranty coverage varies by tire brand and model. Our team will explain all warranty options when you purchase new tires.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What is TPMS and do you service it?</h3>
                <p className="text-gray-600">
                  TPMS (Tire Pressure Monitoring System) alerts you when tire pressure is low. Yes, we service TPMS sensors, including battery replacement, sensor programming, and system diagnostics during tire installation or repair.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready for New Tires or Service?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Visit Auto Shop Demo for expert tire service, competitive pricing, and quality products.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/appointments" className="btn bg-white text-primary hover:bg-gray-100">
              Schedule Tire Service
            </Link>
            <a href="tel:555-123-4567" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
              Call: 555-123-4567
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Tires;
