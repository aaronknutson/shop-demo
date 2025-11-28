import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTrash, FaUser } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showToast } = useToast();

  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadContacts();
  }, [currentPage]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 20
      };

      const response = await axios.get('/admin/contacts', { params });

      if (response.data.success) {
        setContacts(response.data.data.contacts);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/admin/contacts/${contactId}`);
      showToast('Contact deleted successfully', 'success');

      // Close modal if deleted contact was selected
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }

      loadContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      showToast('Failed to delete contact', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactModal = () => {
    setSelectedContact(null);
  };

  return (
    <>
      <Helmet>
        <title>Contacts Management - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-gray-600">Manage customer inquiries and messages</p>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No contact messages found</p>
            </div>
          ) : (
            <>
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openContactModal(contact)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(contact.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                        >
                          <FaEnvelope />
                          <span>{contact.email}</span>
                        </a>
                        <a
                          href={`tel:${contact.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                        >
                          <FaPhone />
                          <span>{contact.phone}</span>
                        </a>
                      </div>

                      <p className="text-gray-700 line-clamp-2">{contact.message}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete contact"
                    >
                      <FaTrash />
                    </button>
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

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeContactModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Received on {format(new Date(selectedContact.createdAt), 'MMMM dd, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={closeContactModal}
                    className="text-gray-400 hover:text-gray-500 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-primary" />
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="text-primary" />
                        <a
                          href={`tel:${selectedContact.phone}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          {selectedContact.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Contact ID:</span>
                        <p className="text-gray-900 font-mono text-xs mt-1">{selectedContact.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p className="text-gray-900 mt-1">
                          {format(new Date(selectedContact.updatedAt), 'MMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    closeContactModal();
                  }}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={closeContactModal}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Contacts;
