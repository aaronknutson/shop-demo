import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaCalendar, FaList, FaFilter, FaTimes, FaPhone, FaEnvelope, FaCar, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAuthAxios } = useAdminAuth();
  const { showSuccess, showError } = useToast();

  const statusFilter = searchParams.get('status') || '';
  const dateFilter = searchParams.get('date') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Helper function to convert 12-hour time format to 24-hour format
  const convertTo24Hour = (time12h) => {
    // If already in 24-hour format (HH:MM), return as is
    if (!time12h.includes('AM') && !time12h.includes('PM')) {
      return time12h;
    }

    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFilter, currentPage]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();

      const params = {
        page: currentPage,
        limit: 100 // Load more for calendar view
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (dateFilter) {
        params.date = dateFilter;
      }

      const response = await axios.get('/appointments/admin/all', { params });

      if (response.data.success) {
        const appointmentsData = response.data.data.appointments;
        setAppointments(appointmentsData);
        setPagination(response.data.data.pagination);

        // Convert to calendar events
        const events = appointmentsData.map(apt => {
          const dateStr = apt.appointmentDate.split('T')[0];
          const time24h = convertTo24Hour(apt.appointmentTime);
          const startDateTime = new Date(`${dateStr}T${time24h}`);
          const endDateTime = new Date(startDateTime.getTime() + apt.duration * 60000);

          return {
            id: apt.id,
            title: `${apt.customerName} - ${apt.serviceType}`,
            start: startDateTime,
            end: endDateTime,
            resource: apt
          };
        }).filter(event => !isNaN(event.start.getTime())); // Filter out invalid dates

        setCalendarEvents(events);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
      showError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const axios = getAuthAxios();
      await axios.patch(`/appointments/admin/${appointmentId}/status`, {
        status: newStatus
      });
      showSuccess('Appointment status updated successfully');
      loadAppointments();
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      showError('Failed to update appointment status');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const axios = getAuthAxios();
      await axios.delete(`/appointments/admin/${appointmentId}`);
      showSuccess('Appointment deleted successfully');
      setSelectedAppointment(null);
      loadAppointments();
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      showError('Failed to delete appointment');
    }
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleEventClick = (event) => {
    setSelectedAppointment(event.resource);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444',
      no_show: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: getStatusColor(event.resource.status),
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px'
      }
    };
  };

  return (
    <>
      <Helmet>
        <title>Appointments - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="mt-2 text-gray-600">Manage service appointments and bookings</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaCalendar />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaList />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => handleFilterChange('status', '')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                !statusFilter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('status', 'pending')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('status', 'confirmed')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => handleFilterChange('status', 'completed')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6" style={{ height: '700px' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleEventClick}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="week"
                step={60}
                showMultiDayTimes
                style={{ height: '100%' }}
              />
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.customerName}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaCalendar className="text-primary" />
                          <span>{format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaClock className="text-primary" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaEnvelope className="text-primary" />
                          <span>{appointment.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaPhone className="text-primary" />
                          <span>{appointment.phone}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">{appointment.serviceType}</span>
                        {appointment.vehicleMake && (
                          <span className="text-sm text-gray-600">
                            {appointment.vehicleYear} {appointment.vehicleMake} {appointment.vehicleModel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedAppointment(null)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedAppointment.customerName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Booked on {format(new Date(selectedAppointment.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-gray-400 hover:text-gray-500 text-2xl"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status Management */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'completed', 'cancelled', 'no_show'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedAppointment.id, status)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                            selectedAppointment.status === status
                              ? 'ring-2 ring-offset-2 ring-primary shadow-md'
                              : 'hover:shadow-md'
                          } ${
                            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            status === 'completed' ? 'bg-green-100 text-green-800' :
                            status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedAppointment.status === status && <FaCheckCircle className="inline mr-2" />}
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Appointment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Date</label>
                        <p className="text-gray-900 font-medium">
                          {format(new Date(selectedAppointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Time</label>
                        <p className="text-gray-900 font-medium">{selectedAppointment.appointmentTime}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Duration</label>
                        <p className="text-gray-900 font-medium">{selectedAppointment.duration} minutes</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Service</label>
                        <p className="text-gray-900 font-medium">{selectedAppointment.serviceType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-primary" />
                        <a href={`mailto:${selectedAppointment.email}`} className="text-primary hover:text-primary-dark">
                          {selectedAppointment.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="text-primary" />
                        <a href={`tel:${selectedAppointment.phone}`} className="text-primary hover:text-primary-dark">
                          {selectedAppointment.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  {selectedAppointment.vehicleMake && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                        <FaCar className="text-primary" />
                        <span>Vehicle Information</span>
                      </h4>
                      <p className="text-gray-900">
                        {selectedAppointment.vehicleYear} {selectedAppointment.vehicleMake} {selectedAppointment.vehicleModel}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedAppointment.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedAppointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    handleDelete(selectedAppointment.id);
                  }}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
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

export default Appointments;
