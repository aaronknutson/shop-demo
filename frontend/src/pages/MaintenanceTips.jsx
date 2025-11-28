import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function MaintenanceTips() {
  const [tips, setTips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadTips();
    loadCategories();
  }, [selectedCategory]);

  const loadTips = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await axios.get(`${API_BASE}/tips`, { params });
      if (response.data.success) {
        setTips(response.data.data.tips);
      }
    } catch (error) {
      console.error('Failed to load tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tips/categories`);
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Car Maintenance Tips - Auto Shop Demo Dallas</title>
        <meta name="description" content="Expert automotive maintenance tips and advice from Auto Shop Demo. Learn how to keep your vehicle running smoothly." />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">Maintenance Tips & Advice</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Expert automotive tips to keep your vehicle running smoothly
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-light border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-600 font-medium">Categories:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : tips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">No tips found</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tips.map((tip) => (
              <motion.div
                key={tip.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link to={`/tips/${tip.slug}`} className="block h-full">
                  <div className="card card-hover h-full flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-primary-50 text-primary text-sm font-semibold rounded">
                        {tip.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                      {tip.title}
                    </h3>

                    <p className="text-gray-600 mb-4 flex-grow">
                      {tip.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{tip.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <span>Read More</span>
                        <FaArrowRight className="text-sm" />
                      </div>
                    </div>

                    {tip.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {tip.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-light">
        <div className="container-custom text-center">
          <h2 className="mb-6">Need Professional Service?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert technicians are here to help with all your automotive needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn btn-primary btn-lg">
              View Services
            </Link>
            <Link to="/quote" className="btn btn-outline btn-lg">
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default MaintenanceTips;
