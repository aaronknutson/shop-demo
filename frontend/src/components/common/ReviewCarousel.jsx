import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useReviews } from '../../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

function ReviewCarousel({ limit = 6 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading, isError } = useReviews({ limit });

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data || data.data.length === 0) {
    return null;
  }

  const reviews = data.data;
  const currentReview = reviews[currentIndex];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="card max-w-4xl mx-auto"
        >
          <FaQuoteLeft className="text-4xl text-primary opacity-20 mb-4" />

          <div className="flex gap-1 mb-4">
            {renderStars(currentReview.rating)}
          </div>

          <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
            "{currentReview.comment}"
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{currentReview.name}</p>
              {currentReview.service && (
                <p className="text-sm text-gray-600">{currentReview.service}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {reviews.length}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 btn btn-primary rounded-full p-3"
            aria-label="Previous review"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 btn btn-primary rounded-full p-3"
            aria-label="Next review"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCarousel;
