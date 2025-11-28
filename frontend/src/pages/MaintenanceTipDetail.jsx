import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaClock, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { BreadcrumbSchema } from '../components/common/StructuredData';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function MaintenanceTipDetail() {
  const { slug } = useParams();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadTip();
  }, [slug]);

  const loadTip = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/tips/${slug}`);
      if (response.data.success) {
        setTip(response.data.data.tip);
      }
    } catch (error) {
      console.error('Failed to load tip:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !tip) {
    return <Navigate to="/tips" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{tip.title} - Auto Shop Demo Dallas</title>
        <meta name="description" content={tip.excerpt} />
        <meta property="og:title" content={`${tip.title} - Auto Shop Demo`} />
        <meta property="og:description" content={tip.excerpt} />
      </Helmet>

      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://autoshopdemomotive.com' },
        { name: 'Maintenance Tips', url: 'https://autoshopdemomotive.com/tips' },
        { name: tip.title, url: `https://autoshopdemomotive.com/tips/${tip.slug}` }
      ]} />

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-sm mb-4 text-gray-200">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-xs" />
            <Link to="/tips" className="hover:text-white transition-colors">
              Maintenance Tips
            </Link>
            <FaChevronRight className="text-xs" />
            <span className="text-white">{tip.title}</span>
          </nav>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {tip.category}
            </span>
          </div>

          <h1 className="mb-4">{tip.title}</h1>

          <div className="flex items-center justify-center gap-4 text-gray-200">
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{tip.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Excerpt */}
              <div className="card bg-primary-50 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {tip.excerpt}
                </p>
              </div>

              {/* Article Body */}
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h2 className="text-3xl font-bold mb-4 mt-8 text-gray-900" {...props} />,
                    h2: ({node, ...props}) => <h3 className="text-2xl font-bold mb-3 mt-6 text-gray-900" {...props} />,
                    h3: ({node, ...props}) => <h4 className="text-xl font-semibold mb-2 mt-4 text-gray-800" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-4 space-y-2 list-disc list-inside" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-4 space-y-2 list-decimal list-inside" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  }}
                >
                  {tip.content}
                </ReactMarkdown>
              </article>

              {/* Tags */}
              {tip.tags && tip.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-600 font-medium">Tags:</span>
                    {tip.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Tips */}
              <div className="mt-8">
                <Link
                  to="/tips"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  <FaArrowLeft />
                  Back to All Tips
                </Link>
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <motion.div
                  className="card bg-gradient-secondary text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Need Professional Help?
                  </h3>
                  <p className="mb-6 text-gray-100">
                    Our expert technicians are ready to help with all your automotive needs.
                  </p>
                  <div className="space-y-3">
                    <Link to="/quote" className="btn bg-white text-secondary hover:bg-gray-100 w-full">
                      Request Quote
                    </Link>
                    <Link to="/services" className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary w-full">
                      View Services
                    </Link>
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Phone:</strong><br />
                      <a href="tel:555-123-4567" className="text-primary hover:text-primary-dark">
                        555-123-4567
                      </a>
                    </p>
                    <p>
                      <strong>Address:</strong><br />
                      1818 Storey Ln #100<br />
                      Dallas, TX 75220
                    </p>
                    <Link to="/location" className="text-primary font-semibold hover:text-primary-dark">
                      Get Directions →
                    </Link>
                  </div>
                </motion.div>

                {/* Business Hours */}
                <motion.div
                  className="card bg-light"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-gray-600">8AM - 6PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">9AM - 4PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tips CTA */}
      <section className="section-padding bg-light">
        <div className="container-custom text-center">
          <h2 className="mb-6">More Maintenance Tips</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our library of automotive maintenance advice and tips
          </p>
          <Link to="/tips" className="btn btn-primary btn-lg">
            View All Tips
          </Link>
        </div>
      </section>
    </>
  );
}

export default MaintenanceTipDetail;
