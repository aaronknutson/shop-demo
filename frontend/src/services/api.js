import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Service Methods

/**
 * Contact Form API
 */
export const contactAPI = {
  /**
   * Submit contact form
   * @param {Object} data - Contact form data
   * @returns {Promise}
   */
  submit: async (data) => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  }
};

/**
 * Quote Request API
 */
export const quoteAPI = {
  /**
   * Submit quote request
   * @param {Object} data - Quote request data
   * @returns {Promise}
   */
  submit: async (data) => {
    const response = await apiClient.post('/quote', data);
    return response.data;
  }
};

/**
 * Coupons API
 */
export const couponsAPI = {
  /**
   * Get all active coupons
   * @returns {Promise}
   */
  getAll: async () => {
    const response = await apiClient.get('/coupons');
    return response.data;
  },

  /**
   * Get coupon by code
   * @param {string} code - Coupon code
   * @returns {Promise}
   */
  getByCode: async (code) => {
    const response = await apiClient.get(`/coupons/${code}`);
    return response.data;
  }
};

/**
 * Reviews API
 */
export const reviewsAPI = {
  /**
   * Get approved reviews
   * @param {Object} params - Query parameters (page, limit, service)
   * @returns {Promise}
   */
  getApproved: async (params = {}) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  }
};

/**
 * Health Check API
 */
export const healthAPI = {
  /**
   * Check API health
   * @returns {Promise}
   */
  check: async () => {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  }
};

export default apiClient;
