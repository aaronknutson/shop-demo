import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

function ProtectedCustomerRoute({ children }) {
  const { customer, loading } = useCustomerAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedCustomerRoute;
