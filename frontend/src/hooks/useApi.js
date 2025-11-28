import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactAPI, quoteAPI, couponsAPI, reviewsAPI } from '../services/api';

/**
 * Custom hook for fetching reviews
 * @param {Object} params - Query parameters (page, limit, service)
 */
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewsAPI.getApproved(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

/**
 * Custom hook for fetching coupons
 */
export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponsAPI.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};

/**
 * Custom hook for fetching a specific coupon by code
 * @param {string} code - Coupon code
 * @param {Object} options - Query options
 */
export const useCoupon = (code, options = {}) => {
  return useQuery({
    queryKey: ['coupon', code],
    queryFn: () => couponsAPI.getByCode(code),
    enabled: !!code,
    ...options
  });
};

/**
 * Custom hook for submitting contact form
 */
export const useContactForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contactAPI.submit(data),
    onSuccess: () => {
      // Invalidate and refetch any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
};

/**
 * Custom hook for submitting quote request
 */
export const useQuoteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => quoteAPI.submit(data),
    onSuccess: () => {
      // Invalidate and refetch any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });
};
