import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function CustomerServiceHistory() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { getAuthAxios } = useCustomerAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadServiceHistory();
  }, [page]);

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();
      const response = await axios.get('/customer/service-history', {
        params: { page, limit: 10 },
      });
      if (response.data.success) {
        setRecords(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      showToast('Failed to load service history', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Service History - Customer Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Service History</h1>

        {records.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FaHistory className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service history yet</h3>
            <p className="text-gray-600">Your completed services will appear here</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              {records.map((record) => (
                <div key={record.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.serviceType}
                        </h3>
                        {record.cost && (
                          <span className="text-lg font-bold text-primary">
                            ${record.cost.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{record.description}</p>
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>Date: {format(new Date(record.serviceDate), 'MMMM dd, yyyy')}</p>
                        {record.vehicleInfo && <p>Vehicle: {record.vehicleInfo}</p>}
                        {record.mileage && <p>Mileage: {record.mileage.toLocaleString()} miles</p>}
                        {record.technician && <p>Technician: {record.technician}</p>}
                      </div>
                      {record.notes && (
                        <p className="mt-3 text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
                <p className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total records)
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CustomerServiceHistory;
