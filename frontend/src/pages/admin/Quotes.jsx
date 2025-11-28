import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEye, FaTrash, FaFilter } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  const statusFilter = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadQuotes();
  }, [statusFilter, currentPage]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 20
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await axios.get('/admin/quotes', { params });

      if (response.data.success) {
        setQuotes(response.data.data.quotes);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load quotes:', err);
      showToast('Failed to load quotes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const axios = getAuthAxios();
      const response = await axios.patch(`/admin/quotes/${quoteId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        showToast('Quote status updated successfully', 'success');
        loadQuotes();
      }
    } catch (err) {
      console.error('Failed to update quote status:', err);
      showToast('Failed to update quote status', 'error');
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/quotes/${quoteId}`);
      showToast('Quote deleted successfully', 'success');
      loadQuotes();
    } catch (err) {
      console.error('Failed to delete quote:', err);
      showToast('Failed to delete quote', 'error');
    }
  };

  const handleFilterChange = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Quotes Management - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
            <p className="mt-2 text-gray-600">Manage service quote requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <button
              onClick={() => handleFilterChange('')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                !statusFilter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('contacted')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'contacted'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Contacted
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange('cancelled')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No quotes found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quote.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{quote.email}</div>
                          <div className="text-sm text-gray-500">{quote.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {quote.vehicleYear || quote.vehicleMake || quote.vehicleModel ? (
                            <div className="text-sm text-gray-900">
                              {quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not specified</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{quote.serviceType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={quote.status}
                            onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                            className="text-xs rounded-full border-0 focus:ring-2 focus:ring-primary"
                            style={{
                              backgroundColor: quote.status === 'pending' ? '#fef3c7' :
                                             quote.status === 'contacted' ? '#dbeafe' :
                                             quote.status === 'completed' ? '#d1fae5' :
                                             '#fee2e2',
                              color: quote.status === 'pending' ? '#92400e' :
                                    quote.status === 'contacted' ? '#1e40af' :
                                    quote.status === 'completed' ? '#065f46' :
                                    '#991b1b'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/quotes/${quote.id}`}
                              className="text-primary hover:text-primary-dark"
                              title="View details"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => handleDelete(quote.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete quote"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Quotes;
