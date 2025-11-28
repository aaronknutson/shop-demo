import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { FaStar, FaCheck, FaTimes, FaTrash, FaFilter } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  const approvedFilter = searchParams.get('approved');
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadReviews();
  }, [approvedFilter, currentPage]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 20
      };

      if (approvedFilter !== null) {
        params.approved = approvedFilter;
      }

      const response = await axios.get('/admin/reviews', { params });

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (reviewId, approved) => {
    try {
      const axios = getAuthAxios();
      await axios.patch(`/admin/reviews/${reviewId}/approval`, { approved });
      showToast(`Review ${approved ? 'approved' : 'rejected'} successfully`, 'success');
      loadReviews();
    } catch (err) {
      console.error('Failed to update review:', err);
      showToast('Failed to update review', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/reviews/${reviewId}`);
      showToast('Review deleted successfully', 'success');
      loadReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
      showToast('Failed to delete review', 'error');
    }
  };

  const handleFilterChange = (approved) => {
    const params = new URLSearchParams(searchParams);
    if (approved !== null) {
      params.set('approved', approved);
    } else {
      params.delete('approved');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Reviews Management - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="mt-2 text-gray-600">Manage customer reviews and testimonials</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                approvedFilter === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('false')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                approvedFilter === 'false'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => handleFilterChange('true')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                approvedFilter === 'true'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    !review.approved ? 'border-l-4 border-yellow-400' : 'border-l-4 border-green-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      {review.service && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Service:</span> {review.service}
                        </p>
                      )}

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      <div className="flex items-center space-x-2">
                        {review.approved ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            <FaCheck />
                            <span>Approved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                            <FaTimes />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {!review.approved ? (
                        <button
                          onClick={() => handleApproval(review.id, true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Approve review"
                        >
                          <FaCheck />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproval(review.id, false)}
                          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          title="Unapprove review"
                        >
                          <FaTimes />
                          <span>Unapprove</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(review.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete review"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-md px-6 py-4 flex items-center justify-between">
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

export default Reviews;
