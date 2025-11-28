import { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
          <div className="text-center max-w-2xl">
            <FaExclamationTriangle className="text-6xl text-secondary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary btn-lg"
              >
                Refresh Page
              </button>
              <Link to="/" className="btn btn-outline btn-lg">
                Go to Homepage
              </Link>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                <pre className="text-sm text-red-700 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
