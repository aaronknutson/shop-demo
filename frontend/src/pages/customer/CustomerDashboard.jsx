import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaHistory, FaPlus } from 'react-icons/fa';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { format } from 'date-fns';

function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { customer, getAuthAxios } = useCustomerAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();
      const response = await axios.get('/customer/dashboard');

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link
      to={link}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Customer Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {customer?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your vehicles and appointments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="My Vehicles"
            value={dashboardData?.stats?.vehicleCount || 0}
            icon={FaCar}
            color="bg-blue-500"
            link="/portal/vehicles"
          />
          <StatCard
            title="Upcoming Appointments"
            value={dashboardData?.stats?.upcomingAppointmentsCount || 0}
            icon={FaCalendarAlt}
            color="bg-green-500"
            link="/portal/appointments"
          />
          <StatCard
            title="Service Records"
            value={dashboardData?.stats?.serviceHistoryCount || 0}
            icon={FaHistory}
            color="bg-purple-500"
            link="/portal/service-history"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/appointments"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <FaCalendarAlt className="text-primary text-2xl" />
              <div>
                <p className="font-medium text-gray-900">Book Appointment</p>
                <p className="text-sm text-gray-600">Schedule a service visit</p>
              </div>
            </Link>
            <Link
              to="/portal/vehicles"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <FaPlus className="text-primary text-2xl" />
              <div>
                <p className="font-medium text-gray-900">Add Vehicle</p>
                <p className="text-sm text-gray-600">Register a new vehicle</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {dashboardData?.upcomingAppointments?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.serviceType}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(appointment.appointmentDate), 'MMMM dd, yyyy')} at{' '}
                        {appointment.appointmentTime}
                      </p>
                      {appointment.vehicleMake && (
                        <p className="text-sm text-gray-500 mt-1">
                          {appointment.vehicleYear} {appointment.vehicleMake} {appointment.vehicleModel}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link
                to="/portal/appointments"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View all appointments →
              </Link>
            </div>
          </div>
        )}

        {/* Recent Service History */}
        {dashboardData?.recentServiceHistory?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Service History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentServiceHistory.map((record) => (
                <div key={record.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{record.serviceType}</p>
                      <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                      {record.vehicleInfo && (
                        <p className="text-sm text-gray-500 mt-1">{record.vehicleInfo}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${record.cost?.toFixed(2) || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(record.serviceDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link
                to="/portal/service-history"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View all service history →
              </Link>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!loading &&
          dashboardData?.stats?.vehicleCount === 0 &&
          dashboardData?.stats?.upcomingAppointmentsCount === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <FaCar className="mx-auto text-4xl text-blue-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Get Started
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first vehicle to start managing your automotive service records.
              </p>
              <Link
                to="/portal/vehicles"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Your First Vehicle
              </Link>
            </div>
          )}
      </div>
    </>
  );
}

export default CustomerDashboard;
