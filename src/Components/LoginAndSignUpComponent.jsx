import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const LoginAndSignUpComponent = ({ formik, userError, toggleState, isLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  // console.log('userError:', userError); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const phoneNumberErrorHandling = (numberOfPhone) => {
    if (numberOfPhone.length < 10) {
      return <p className="text-red-500">Phone Number Must be at least 10 digits</p>;
    } else if (numberOfPhone.length > 14) {
      return <p className="text-red-500">Phone Number Must be less than 15 characters</p>;
    }
    return null;
  };

  const userNameErrorHandling = (nameOfUser) => {
    if(nameOfUser.length < 8) {
      return <p className="text-red-500">Username must be at least 8 characters</p>;
    } else if (nameOfUser.length > 32) {
      return <p className="text-red-500">Username must be less than 33 characters</p>;
    }
  }

  const sanitizeAndHandleChange = (event) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    formik.handleChange({
      target: {
        name: event.target.name,
        value: sanitizedValue,
      },
    });
  };


  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white ${!isLogin ? 'mt-12' : ''}`}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {userError && <p className="text-red-500 mb-4">{userError}</p>}
        <form onSubmit={formik.handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 text-left mb-2">Username:</label>
              <input
                required
                type="text"
                name="username"
                onChange={sanitizeAndHandleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
                placeholder="Enter your username"
              />
              {formik.errors.username && <p className="text-red-500">{formik.errors.username}</p>}
              {formik.touched.username && userNameErrorHandling(formik.values.username)}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 text-left mb-2">Email:</label>
            <input
              required
              type="email"
              name="email"
              onChange={sanitizeAndHandleChange}
              value={formik.values.email}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your email"
            />
            {formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 text-left mb-2">Phone Number:</label>
              <input
                required
                type="text"
                name="phoneNumber"
                onChange={sanitizeAndHandleChange}
                onBlur={formik.handleBlur} 
                value={formik.values.phoneNumber}
                className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
                placeholder="Enter your phone number (digits only)"
              />
              {formik.errors.phoneNumber && <p className="text-red-500">{formik.errors.phoneNumber}</p>}
              {formik.touched.phoneNumber && phoneNumberErrorHandling(formik.values.phoneNumber)}
            </div>
          )}
          <div className="mb-4 relative">
            <label className="block text-gray-300 text-left mb-2">Password:</label>
            <input
              required
              type={showPassword ? 'text' : 'password'}
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 text-left mb-2">Date of Birth:</label>
              <input
                required
                type="date"
                name="dateOfBirth"
                onChange={formik.handleChange}
                value={formik.values.dateOfBirth}
                className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              />
              {formik.errors.dateOfBirth && <p className="text-red-500">{formik.errors.dateOfBirth}</p>}
            </div>
          )}
          {isLogin && (
            <div className="mb-4">
              <Link to="/forgot-password" className="text-blue-400 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            className={`${isLogin ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 px-4 rounded w-full`}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
          <button onClick={toggleState} className="text-blue-400 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

LoginAndSignUpComponent.propTypes = {
  formik: PropTypes.shape({
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    values: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      phoneNumber: PropTypes.string,
      dateOfBirth: PropTypes.string,
    }).isRequired,
    errors: PropTypes.object,
    touched: PropTypes.object
  }).isRequired,
  userError: PropTypes.string,
  toggleState: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

export default LoginAndSignUpComponent;
