import { Helmet } from 'react-helmet-async';
import { FaAward, FaUsers, FaTools, FaHeart } from 'react-icons/fa';
import { CONTACT_INFO } from '../config/contact';

function About() {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - parseInt(CONTACT_INFO.established);
  const values = [
    {
      icon: FaAward,
      title: 'Quality Service',
      description: 'We use only the best parts and employ skilled technicians to ensure top-quality repairs.'
    },
    {
      icon: FaUsers,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We treat every customer like family.'
    },
    {
      icon: FaTools,
      title: 'Expert Technicians',
      description: 'Our team has decades of combined experience in automotive repair and diagnostics.'
    },
    {
      icon: FaHeart,
      title: 'Honest Pricing',
      description: 'Transparent pricing with no hidden fees. We explain every repair before we start.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {CONTACT_INFO.businessName} | {CONTACT_INFO.address.city} Auto Repair Since {CONTACT_INFO.established}</title>
        <meta name="description" content={`Learn about ${CONTACT_INFO.businessName}, ${CONTACT_INFO.address.city} trusted auto repair shop since ${CONTACT_INFO.established}. Quality service, honest pricing, and expert care for your vehicle.`} />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">About {CONTACT_INFO.businessName}</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Serving the {CONTACT_INFO.address.city} community with honest, reliable auto repair services since {CONTACT_INFO.established}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                For over {yearsInBusiness} years, {CONTACT_INFO.businessName} has been {CONTACT_INFO.address.city}'s trusted source for quality auto repair.
                Established in {CONTACT_INFO.established}, we've built our reputation on honest service, expert craftsmanship, and
                treating every customer like family.
              </p>
              <p>
                What started as a small neighborhood garage has grown into one of {CONTACT_INFO.address.city}'s most respected
                auto repair facilities. Through it all, we've never forgotten our roots or the values that
                got us here: integrity, quality, and putting our customers first.
              </p>
              <p>
                Today, we continue to serve the Dallas community with the same dedication and expertise that
                has defined us for nearly four decades. Whether it's a routine oil change or a complex engine
                repair, we bring the same level of care and attention to every job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <h2 className="text-center mb-12">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="card card-hover">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <value.icon className="text-4xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">38+</div>
              <div className="text-xl">Years in Business</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-xl">Satisfied Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-xl">Services Offered</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
