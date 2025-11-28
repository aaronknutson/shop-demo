import { FaTag, FaCalendarAlt, FaPrint } from 'react-icons/fa';

function CouponCard({ coupon, printable = true }) {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card card-hover border-2 border-dashed border-primary relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 transform rotate-45 translate-x-8 -translate-y-8" />

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <FaTag className="text-4xl text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{coupon.title}</h3>
          <p className="text-gray-600 mb-3">{coupon.description}</p>

          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold">
              <FaTag className="text-sm" />
              <span>{coupon.discount}</span>
            </div>

            <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
              <FaCalendarAlt />
              <span>Expires: {formatDate(coupon.expiresAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Coupon Code
              </p>
              <p className="font-mono font-bold text-lg text-primary">
                {coupon.code}
              </p>
            </div>

            {printable && (
              <button
                onClick={handlePrint}
                className="btn btn-outline btn-sm print:hidden"
                aria-label="Print coupon"
              >
                <FaPrint />
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          .card {
            page-break-inside: avoid;
            border: 2px dashed #1a56db;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}

export default CouponCard;
