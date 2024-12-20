import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '/src/authentication/AuthContext.jsx';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated && ! loading) {
      navigate('/login-signup')
    }
  },[isAuthenticated, loading, navigate])

  if(loading) {
    return <div>loading...</div>
  }

  if (!isAuthenticated) {
    navigate('/login-signup');
    return null; // Prevent rendering the `children`
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

