import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import PropTypes from 'prop-types';


const LoginAndSignUpComponent = ({ formik, userError }) => {
  const [isLogin, setIsLogin] = useState(true);
   // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const authenticateWithPasskey = async (identifier, password) => {
    // console.log('Initiating passkey authentication for user input:',identifier); 

    try {
        // const payload = { identifier, password, username: formik.values.username, email: formik.values.email };
        // console.log('Payload:', payload);
        const userIdentifier = identifier || (isLogin ? (formik.values.email || formik.values.username) : '');

        const response = await axios.post(`${import.meta.env.REACT_APP_BACKEND_API}/authenticate-passkey`, { identifier: userIdentifier });
        const publicKeyCredentialRequestOptions = response.data;
        // console.log('Public Key Credential Request Options:', publicKeyCredentialRequestOptions);

        const credential = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });
        // console.log('Created credential:', credential); 

        const webauthnid = credential.id;
        const webauthnpublickey = credential.rawId;

        const existingUserResponse = await axios.post(`${import.meta.env.REACT_APP_BACKEND_API}/verify-passkey`, {
            credential,
            identifier: userIdentifier,
            password,
            userId: publicKeyCredentialRequestOptions.user.id,
            webauthnid, 
            webauthnpublickey 
        });

        // console.log('Verification Response:', existingUserResponse.data); 

        const { token, expiresIn } = existingUserResponse.data;
        // console.log('Received token:', token); 
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        // console.log('Token expiration date:', expirationDate); 

        Cookies.set('token', token, { expires: expirationDate, secure: true, sameSite: 'strict' });
        login(token);
        navigate('/dashboard');
    } catch (error) {
        console.error('Error during authentication:', error); 
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    try {
        await authenticateWithPasskey(formik.values.identifier, formik.values.password);
    } catch (error) {
        console.error('Error during passkey login:', error);
        setError(error.response?.data?.error || 'Failed to authenticate with passkey. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {userError && <p className="text-red-500 mb-4">{userError}</p>}
        <form onSubmit={formik.handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Username:</label>
              <input
                required
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
                placeholder="Enter your username"
              />
              {formik.errors.username && <p className="text-red-500">{formik.errors.username}</p>}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email:</label>
            <input
              required
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your email"
            />
            {formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Phone Number:</label>
              <input
                required
                type="text"
                name="phoneNumber"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
                placeholder="Enter your phone number"
              />
              {formik.errors.phoneNumber && <p className="text-red-500">{formik.errors.phoneNumber}</p>}
            </div>
          )}
          <div className="mb-4 relative">
            <label className="block text-gray-300 mb-2">Password:</label>
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
              <label className="block text-gray-300 mb-2">Date of Birth:</label>
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
  
          {isLogin ? (
            <button
              onClick={handlePasskeyLogin}
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
            >
              Login with Passkey
            </button>
          ) : (
            <button
              onClick={handlePasskeyLogin}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
            >
              Sign Up with Passkey
            </button>
          )}
        </form>
        <p className="mt-4">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
          <button onClick={handleToggle} className="text-blue-400 hover:underline">
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
    values: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      phoneNumber: PropTypes.string,
      dateOfBirth: PropTypes.string,
      identifier: PropTypes.string
    }).isRequired,
    errors: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      phoneNumber: PropTypes.string,
      dateOfBirth: PropTypes.string
    })
  }).isRequired,
  userError: PropTypes.string
};

export default LoginAndSignUpComponent;
