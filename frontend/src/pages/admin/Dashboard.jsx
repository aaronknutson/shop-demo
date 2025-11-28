import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  FaQuoteRight,
  FaEnvelope,
  FaStar,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { format } from 'date-fns';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAuthAxios } = useAdminAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const axios = getAuthAxios();
      const response = await axios.get('/admin/dashboard/stats');

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentQuotes(response.data.data.recentQuotes);
        setRecentContacts(response.data.data.recentContacts);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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
        <title>Dashboard - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Quotes"
            value={stats?.totalQuotes || 0}
            icon={FaQuoteRight}
            color="bg-blue-500"
            link="/admin/quotes"
          />
          <StatCard
            title="Pending Quotes"
            value={stats?.pendingQuotes || 0}
            icon={FaClock}
            color="bg-yellow-500"
            link="/admin/quotes?status=pending"
          />
          <StatCard
            title="Total Contacts"
            value={stats?.totalContacts || 0}
            icon={FaEnvelope}
            color="bg-green-500"
            link="/admin/contacts"
          />
          <StatCard
            title="Pending Reviews"
            value={stats?.pendingReviews || 0}
            icon={FaStar}
            color="bg-purple-500"
            link="/admin/reviews?approved=false"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Appointments"
            value={stats?.totalAppointments || 0}
            icon={FaCalendarAlt}
            color="bg-indigo-500"
            link="/admin/appointments"
          />
          <StatCard
            title="Today's Appointments"
            value={stats?.todayAppointments || 0}
            icon={FaClock}
            color="bg-orange-500"
            link="/admin/appointments"
          />
          <StatCard
            title="Active Coupons"
            value={stats?.activeCoupons || 0}
            icon={FaTicketAlt}
            color="bg-pink-500"
            link="/admin/coupons"
          />
          <StatCard
            title="Total Reviews"
            value={stats?.totalReviews || 0}
            icon={FaCheckCircle}
            color="bg-teal-500"
            link="/admin/reviews"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quotes */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quotes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    to={`/admin/quotes/${quote.id}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{quote.name}</p>
                        <p className="text-sm text-gray-600">{quote.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{quote.serviceType}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            quote.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : quote.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : quote.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {quote.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent quotes
                </div>
              )}
            </div>
            {recentQuotes.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/admin/quotes"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  View all quotes →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="px-6 py-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500">
                          {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent contacts
                </div>
              )}
            </div>
            {recentContacts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/admin/contacts"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  View all contacts →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
