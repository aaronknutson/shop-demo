import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function Tips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    excerpt: '',
    content: '',
    readTime: '',
    tags: [],
    published: false
  });
  const [tagInput, setTagInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  const publishedFilter = searchParams.get('published');
  const categoryFilter = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const categories = [
    'Maintenance',
    'Repair',
    'Safety',
    'DIY',
    'Seasonal',
    'General'
  ];

  useEffect(() => {
    loadTips();
  }, [publishedFilter, categoryFilter, currentPage]);

  const loadTips = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 20
      };

      if (publishedFilter !== null) {
        params.published = publishedFilter;
      }

      if (categoryFilter) {
        params.category = categoryFilter;
      }

      const response = await axios.get('/admin/tips', { params });

      if (response.data.success) {
        setTips(response.data.data.tips);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load tips:', err);
      showToast('Failed to load tips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      category: '',
      excerpt: '',
      content: '',
      readTime: '',
      tags: [],
      published: false
    });
    setTagInput('');
    setEditingTip(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (tip) => {
    setEditingTip(tip);
    setFormData({
      slug: tip.slug,
      title: tip.title,
      category: tip.category,
      excerpt: tip.excerpt,
      content: tip.content,
      readTime: tip.readTime,
      tags: tip.tags || [],
      published: tip.published
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: editingTip ? formData.slug : generateSlug(title)
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const axios = getAuthAxios();

      if (editingTip) {
        await axios.put(`/admin/tips/${editingTip.id}`, formData);
        showToast('Tip updated successfully', 'success');
      } else {
        await axios.post('/admin/tips', formData);
        showToast('Tip created successfully', 'success');
      }

      closeModal();
      loadTips();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save tip';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (tipId) => {
    if (!window.confirm('Are you sure you want to delete this tip?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/tips/${tipId}`);
      showToast('Tip deleted successfully', 'success');
      loadTips();
    } catch (err) {
      showToast('Failed to delete tip', 'error');
    }
  };

  const handleTogglePublished = async (tip) => {
    try {
      const axios = getAuthAxios();
      await axios.patch(`/admin/tips/${tip.id}/toggle-published`);
      showToast(`Tip ${tip.published ? 'unpublished' : 'published'} successfully`, 'success');
      loadTips();
    } catch (err) {
      showToast('Failed to update tip status', 'error');
    }
  };

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(searchParams);

    if (filterType === 'published') {
      if (value !== null) {
        params.set('published', value);
      } else {
        params.delete('published');
      }
    } else if (filterType === 'category') {
      if (value) {
        params.set('category', value);
      } else {
        params.delete('category');
      }
    }

    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>Tips Management - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Tips</h1>
            <p className="mt-2 text-gray-600">Manage blog posts and maintenance tips</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaPlus />
            <span>Create Tip</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          {/* Published Status Filter */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <button
              onClick={() => handleFilterChange('published', null)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                publishedFilter === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('published', 'true')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                publishedFilter === 'true'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => handleFilterChange('published', 'false')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                publishedFilter === 'false'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Draft
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                !categoryFilter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tips List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : tips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tips found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tips.map((tip) => (
                <div key={tip.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tip.category}
                        </span>
                        {tip.published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                            <FaEye className="text-xs" />
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Draft
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{tip.excerpt}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Slug: <code className="text-xs bg-gray-100 px-2 py-1 rounded">{tip.slug}</code></span>
                        <span>Read time: {tip.readTime}</span>
                        {tip.tags && tip.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>Tags:</span>
                            {tip.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        Created: {format(new Date(tip.createdAt), 'MMM dd, yyyy')} |
                        Updated: {format(new Date(tip.updatedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleTogglePublished(tip)}
                        className={`p-2 rounded-lg ${
                          tip.published
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={tip.published ? 'Unpublish' : 'Publish'}
                      >
                        {tip.published ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        onClick={() => openEditModal(tip)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit tip"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(tip.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete tip"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingTip ? 'Edit Tip' : 'Create New Tip'}
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
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., How to Check Your Oil"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          Slug *
                        </label>
                        <input
                          type="text"
                          id="slug"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                          placeholder="how-to-check-your-oil"
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category *
                        </label>
                        <select
                          id="category"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                        Excerpt *
                      </label>
                      <textarea
                        id="excerpt"
                        required
                        rows="2"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Brief summary (20-500 characters)..."
                        maxLength="500"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
                    </div>

                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content *
                      </label>
                      <textarea
                        id="content"
                        required
                        rows="10"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Full article content..."
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
                        Read Time *
                      </label>
                      <input
                        type="text"
                        id="readTime"
                        required
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., 5 min read"
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          id="tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="block flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Type a tag and press Enter"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Add
                        </button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary text-white text-sm rounded-full flex items-center gap-2"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-200"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        Publish immediately
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingTip ? 'Update' : 'Create'}
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

export default Tips;
