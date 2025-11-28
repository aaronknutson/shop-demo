import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { getAuthAxios } = useCustomerAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      const axios = getAuthAxios();
      const params = {};
      if (filter === 'upcoming') params.upcoming = 'true';
      if (filter !== 'all' && filter !== 'upcoming') params.status = filter;

      const response = await axios.get('/customer/appointments', { params });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const axios = getAuthAxios();
      await axios.patch(`/customer/appointments/${id}/cancel`);
      showToast('Appointment cancelled successfully', 'success');
      loadAppointments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to cancel appointment', 'error');
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
        <title>My Appointments - Customer Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <Link
            to="/appointments"
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaPlus />
            <span>Book Appointment</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {['all', 'upcoming', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {appointments.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">Book your next service appointment</p>
            <Link
              to="/appointments"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FaPlus className="mr-2" />
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.serviceType}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy')} at{' '}
                      {appointment.appointmentTime}
                    </p>
                    {appointment.vehicleMake && (
                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.vehicleYear} {appointment.vehicleMake} {appointment.vehicleModel}
                      </p>
                    )}
                    {appointment.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">{appointment.notes}</p>
                    )}
                  </div>
                  {['pending', 'confirmed'].includes(appointment.status) && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="ml-4 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CustomerAppointments;
