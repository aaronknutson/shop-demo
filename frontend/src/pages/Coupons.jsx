import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';
import { useCoupons } from '../hooks/useApi';
import CouponCard from '../components/common/CouponCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Coupons() {
  const { data, isLoading, isError, error } = useCoupons();

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Coupons & Specials - Auto Shop Demo Dallas</title>
        <meta name="description" content="Save money on auto repair with special offers and coupons from Auto Shop Demo in Dallas, TX. View our current deals and discounts." />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">Coupons & Specials</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Save money on quality auto repair services with our current offers
          </p>
        </div>
      </section>

      {/* Coupons Section */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading && (
            <div className="py-12">
              <LoadingSpinner size="lg" />
              <p className="text-center text-gray-600 mt-4">Loading coupons...</p>
            </div>
          )}

          {isError && (
            <div className="card bg-red-50 border-red-200 text-center py-12">
              <p className="text-red-800 mb-4">
                Unable to load coupons at this time. Please try again later.
              </p>
              <p className="text-sm text-red-600">
                {error?.response?.data?.message || error?.message}
              </p>
            </div>
          )}

          {data && data.data && (
            <>
              {data.data.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-8 print:hidden">
                    <div>
                      <h2 className="mb-2">Available Coupons</h2>
                      <p className="text-gray-600">
                        {data.count} {data.count === 1 ? 'coupon' : 'coupons'} available
                      </p>
                    </div>
                    <button
                      onClick={handlePrintAll}
                      className="btn btn-outline"
                    >
                      <FaPrint />
                      Print All Coupons
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.data.map((coupon) => (
                      <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
                    <div className="prose prose-sm text-gray-600">
                      <ul>
                        <li>Coupons cannot be combined with other offers</li>
                        <li>One coupon per customer per visit</li>
                        <li>Must present coupon at time of service</li>
                        <li>Valid only at Auto Shop Demo Dallas location</li>
                        <li>Some restrictions may apply - call for details</li>
                        <li>Expired coupons will not be honored</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">
                    No coupons available at this time.
                  </p>
                  <p className="text-gray-500 mb-6">
                    Check back soon for new special offers!
                  </p>
                  <Link to="/contact" className="btn btn-primary">
                    Contact Us for Pricing
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-light print:hidden">
        <div className="container-custom text-center">
          <h2 className="mb-6">Ready to Save?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your appointment and redeem your coupon
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

      {/* Print-specific styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Coupons;
