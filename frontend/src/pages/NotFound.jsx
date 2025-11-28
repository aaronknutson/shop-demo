import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Auto Shop Demo</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Helmet>

      <section className="section-padding min-h-screen flex items-center justify-center bg-light">
        <div className="container-custom text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome />
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
