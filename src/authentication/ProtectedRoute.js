// import PropTypes from 'prop-types';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// ProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default ProtectedRoute;


import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/authentication/AuthContext.jsx';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null; // Prevent rendering the `children`
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

