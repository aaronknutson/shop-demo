import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Debug log
console.log('Login Page - API URL:', API_URL);

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const adminAuth = useAdminAuth();
  const customerAuth = useCustomerAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/unified-auth/login`, data);

      if (response.data.success) {
        const { userType, redirectTo, user, token } = response.data.data;

        // Store authentication based on user type
        if (userType === 'admin') {
          localStorage.setItem('admin', JSON.stringify(user));
          localStorage.setItem('adminToken', token);
          // Update admin auth context
          window.location.href = redirectTo; // Force reload to update context
        } else if (userType === 'customer') {
          localStorage.setItem('customerToken', token);
          // Update customer auth context by reloading
          window.location.href = redirectTo; // Force reload to update context
        }

        showSuccess('Login successful! Redirecting...');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      showError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Auto Shop Demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-primary">Auto Shop Demo</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your account or customer portal
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-blue-900">Demo Accounts:</p>
            <div>
              <p className="text-xs font-medium text-blue-800 mb-1">Customer Portal:</p>
              <p className="text-xs text-blue-700">Email: demo@customer.com</p>
              <p className="text-xs text-blue-700">Password: Demo123!</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800 mb-1">Admin Dashboard:</p>
              <p className="text-xs text-blue-700">Email: admin@autoshopdemo.com</p>
              <p className="text-xs text-blue-700">Password: Admin123!</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-primary focus:border-primary`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-primary focus:border-primary`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New customer?{' '}
                <Link to="/portal/register" className="font-medium text-primary hover:text-primary-dark">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Back to Website */}
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                � Back to main website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
