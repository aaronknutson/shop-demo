import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhone, FaCar, FaCalendar, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function QuoteDetail() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadQuote();
  }, [id]);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();
      const response = await axios.get(`/admin/quotes/${id}`);

      if (response.data.success) {
        setQuote(response.data.data.quote);
      }
    } catch (err) {
      console.error('Failed to load quote:', err);
      showToast('Failed to load quote', 'error');
      navigate('/admin/quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const axios = getAuthAxios();
      await axios.patch(`/admin/quotes/${id}/status`, { status: newStatus });
      showToast('Status updated successfully', 'success');
      loadQuote();
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/quotes/${id}`);
      showToast('Quote deleted successfully', 'success');
      navigate('/admin/quotes');
    } catch (err) {
      console.error('Failed to delete quote:', err);
      showToast('Failed to delete quote', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Quote Details - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/quotes"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Details</h1>
              <p className="mt-1 text-gray-600">
                Received on {format(new Date(quote.createdAt), 'MMMM dd, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash />
            <span>Delete Quote</span>
          </button>
        </div>

        {/* Status Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['pending', 'contacted', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all
                  ${quote.status === status
                    ? 'ring-2 ring-offset-2 ring-primary shadow-md'
                    : 'hover:shadow-md'
                  }
                  ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${status === 'contacted' ? 'bg-blue-100 text-blue-800' : ''}
                  ${status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  ${status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}
              >
                {quote.status === status && <FaCheckCircle className="inline mr-2" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900 font-medium">{quote.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                  <FaEnvelope className="text-primary" />
                  <span>Email</span>
                </label>
                <a
                  href={`mailto:${quote.email}`}
                  className="mt-1 text-primary hover:text-primary-dark block"
                >
                  {quote.email}
                </a>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                  <FaPhone className="text-primary" />
                  <span>Phone</span>
                </label>
                <a
                  href={`tel:${quote.phone}`}
                  className="mt-1 text-primary hover:text-primary-dark block"
                >
                  {quote.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FaCar className="text-primary" />
              <span>Vehicle Information</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Make</label>
                <p className="mt-1 text-gray-900">{quote.vehicleMake || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Model</label>
                <p className="mt-1 text-gray-900">{quote.vehicleModel || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Year</label>
                <p className="mt-1 text-gray-900">{quote.vehicleYear || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Service Type</label>
              <p className="mt-1 text-gray-900 font-medium">{quote.serviceType}</p>
            </div>
            {quote.preferredDate && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                  <FaCalendar className="text-primary" />
                  <span>Preferred Date</span>
                </label>
                <p className="mt-1 text-gray-900">
                  {format(new Date(quote.preferredDate), 'MMMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
          {quote.message && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Additional Notes</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{quote.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Quote ID</label>
              <p className="mt-1 text-gray-900 font-mono text-xs">{quote.id}</p>
            </div>
            <div>
              <label className="text-gray-500">Created</label>
              <p className="mt-1 text-gray-900">
                {format(new Date(quote.createdAt), 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Last Updated</label>
              <p className="mt-1 text-gray-900">
                {format(new Date(quote.updatedAt), 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuoteDetail;
