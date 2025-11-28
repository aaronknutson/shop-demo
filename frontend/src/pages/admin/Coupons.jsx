import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaTimes } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    code: '',
    expiresAt: '',
    active: true
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  const activeFilter = searchParams.get('active');
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadCoupons();
  }, [activeFilter, currentPage]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 20
      };

      if (activeFilter !== null) {
        params.active = activeFilter;
      }

      const response = await axios.get('/admin/coupons', { params });

      if (response.data.success) {
        setCoupons(response.data.data.coupons);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      code: '',
      expiresAt: '',
      active: true
    });
    setEditingCoupon(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description,
      discount: coupon.discount,
      code: coupon.code,
      expiresAt: format(new Date(coupon.expiresAt), 'yyyy-MM-dd'),
      active: coupon.active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const axios = getAuthAxios();
      const payload = {
        ...formData,
        code: formData.code.toUpperCase()
      };

      if (editingCoupon) {
        await axios.patch(`/admin/coupons/${editingCoupon.id}`, payload);
        showToast('Coupon updated successfully', 'success');
      } else {
        await axios.post('/admin/coupons', payload);
        showToast('Coupon created successfully', 'success');
      }

      closeModal();
      loadCoupons();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save coupon';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/coupons/${couponId}`);
      showToast('Coupon deleted successfully', 'success');
      loadCoupons();
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const handleFilterChange = (active) => {
    const params = new URLSearchParams(searchParams);
    if (active !== null) {
      params.set('active', active);
    } else {
      params.delete('active');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <>
      <Helmet>
        <title>Coupons Management - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="mt-2 text-gray-600">Manage promotional coupons and special offers</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaPlus />
            <span>Create Coupon</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeFilter === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('true')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeFilter === 'true'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('false')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeFilter === 'false'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No coupons found</p>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white rounded-lg shadow-md p-6 border-2 ${
                  !coupon.active || isExpired(coupon.expiresAt)
                    ? 'border-gray-300 opacity-60'
                    : 'border-primary'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{coupon.title}</h3>
                    <p className="text-2xl font-bold text-primary mt-1">{coupon.discount}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit coupon"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete coupon"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Code:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm font-bold">
                      {coupon.code}
                    </code>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Expires:</span>
                    <span className={`text-sm ${isExpired(coupon.expiresAt) ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    {coupon.active && !isExpired(coupon.expiresAt) ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {isExpired(coupon.expiresAt) ? 'Expired' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="e.g., Oil Change Special"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        required
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Describe the coupon offer..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                          Discount *
                        </label>
                        <input
                          type="text"
                          id="discount"
                          required
                          value={formData.discount}
                          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          placeholder="e.g., $20 OFF"
                        />
                      </div>

                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          Code *
                        </label>
                        <input
                          type="text"
                          id="code"
                          required
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary font-mono"
                          placeholder="SAVE20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                        Expiration Date *
                      </label>
                      <input
                        type="date"
                        id="expiresAt"
                        required
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingCoupon ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Coupons;
