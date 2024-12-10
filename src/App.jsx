/* eslint-disable no-unused-vars */

import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import DOMPurify from 'dompurify';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthProvider, useAuth } from './authentication/AuthContext';
import ProtectedRoute from './authentication/ProtectedRoute';
import validationSchema from './Validations/validationSchema';
import { base64ToArrayBuffer } from './utils/arrayBufferUtils';
// import { signUpUser, loginUser } from './utils/authUtils';

// Commons
import Navbar from './Commons/Navbar';
import Footer from './Commons/Footer';

// Pages
import About from './Pages/About';
import Contact from './Pages/Contact';
import Home from './Pages/Home';
import LoginAndSignUp from './Pages/LoginAndSignUp'; 
import FourOFour from './Pages/FourOFour';
import LearnMore from './Pages/LearnMore';
import Dashboard from './Pages/Dashboard';
import RegisterPasskey from './Pages/RegisterPasskey';


const AppContent = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [isLogin, setIsLogin] = useState(true);
  // eslint-disable-next-line no-use-before-define
  const [userError, setUserError] = useState('');
  const { login, logout, reset } = useAuth();
  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  const signUpUser = async (userData) => {
    try {
      const response = await axios.post(`${backEndUrl}/sign-up`, userData);
      // console.log('Sign-up response:', response.data);
      
      if (response.data && response.data.message === "User created") {
        return response.data.user; 
      } else {
        throw new Error("Sign-up failed. Please try again."); 
      }
    } catch (error) {
      // Log or rethrow the error for the calling function to handle
      console.error("Error during sign-up:", error);
      throw error.response?.data?.message || error.message; 
  };
}

const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${backEndUrl}/sign-in`, userData);
    // console.log('response:', response);
    // console.log('message:', response.data.message);
    if (response.data && response.data.message === "Sign in successful") {
      // console.log('Login response App.js:', response.data);
      return {
        token: response.data.token,
        userId: response.data.user.id,
        email: response.data.email, 
        expiresIn: response.data.expiresIn,
        hasRegisteredPasskey: response.data.hasRegisteredPasskey, 
      };
    } else {
      throw new Error("Login failed. Please try again."); 
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response?.data?.message || error.message; 
  }
};


  const registerPasskey = async (userId, email) => {
    // console.log('Registering passkey with userId:', userId, 'and email:', email);

    if (!userId || !email) {
      console.error('User ID or Email is undefined!');
      return;
    }
    const response = await axios.post(`${backEndUrl}/register-passkey`, { userId, email });
    const publicKeyCredentialCreationOptions = response.data;
    // console.log('publicKeyCredentialCreationOptions:', publicKeyCredentialCreationOptions);
    // console.log('Received challenge from backend:', publicKeyCredentialCreationOptions.challenge);

    const challengeBuffer = base64ToArrayBuffer(publicKeyCredentialCreationOptions.challenge);
    publicKeyCredentialCreationOptions.challenge = challengeBuffer;
    publicKeyCredentialCreationOptions.user.id = new TextEncoder().encode(userId);

    let credential;
    try {
      credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
      // console.log('Created credential:', credential);
    } catch (error) {
      console.error('Error during credential creation:', error);
      throw error;
    }

    const webauthnid = credential.id;
    const webauthnpublickey = credential.rawId;

    await axios.post(`${backEndUrl}/verify-passkey`, {
      credential,
      email,
      userId,
      webauthnid,
      webauthnpublickey,
    });

    return { webauthnid, webauthnpublickey };
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      dateOfBirth: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const sanitizedValues = {
          username: isLogin ? null : DOMPurify.sanitize(values.username),
          email: DOMPurify.sanitize(values.email),
          password: values.password,
          dateOfBirth: isLogin ? null : DOMPurify.sanitize(values.dateOfBirth),
          phoneNumber: isLogin ? null : DOMPurify.sanitize(values.phoneNumber),
        };
  
        if (isLogin) {
          if (!sanitizedValues.identifier && sanitizedValues.email) {
            sanitizedValues.identifier = sanitizedValues.email;
            // console.log('Email copied to identifier:', sanitizedValues.identifier);
          }
        }
  
        const userData = isLogin
          ? {
              identifier: sanitizedValues.email || sanitizedValues.username || sanitizedValues.phoneNumber,
              password: sanitizedValues.password,
            }
          : {
              email: sanitizedValues.email,
              password: sanitizedValues.password,
              username: sanitizedValues.username,
              dateOfBirth: sanitizedValues.dateOfBirth,
              phoneNumber: sanitizedValues.phoneNumber,
            };
  
        // console.log('userData before login:', userData);
  
        let response;
  
        if (isLogin) {
          response = await loginUser(userData);
          // console.log('response 10:', response);
        } else {
          setIsLogin(isLogin => !isLogin);
          // console.log('login state:', isLogin);
          response = await signUpUser(sanitizedValues);
          // console.log('userId:', response.userId);
          navigate('/');
          return;
        }
  
        // console.log('Login response:', response);
  
        const { token, expiresIn, hasRegisteredPasskey } = response;
  
        if (token) {
          if (!expiresIn) {
            console.error('Token expiration not found in login response. Cannot set token.');
            throw new Error('Token expiration not found in login response. Cannot set token.');
          }
          const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
          // console.log('Expiration date:', expirationDate);
          Cookies.set('token', token, { expires: expirationDate, secure: true, sameSite: 'strict' });
          // console.log('Token:', token);
          login(token);
  
          if (!hasRegisteredPasskey) {
            navigate('/register-passkey', { state: { userId: response.userId, email: sanitizedValues.email } });
          } else {
            navigate(`/dashboard/${response.userId}`);
            
          }
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        setUserError(error.response?.data?.error || 'Invalid Credentials. Please try again.');
      }
    },
  });
  

    // Logout function
    const handleLogout = () => {
      logout(); 
      reset(); 
      formik.resetForm(); 
      navigate('/'); 
  };

 

  const handleToggle = () => {
    setIsLogin(prevIsLogin => !prevIsLogin);
    // console.log('state change');
    // console.log('isLogin:', isLogin);
  };

  useEffect(() => {
    // console.log('isLogin updated:', isLogin);
  }, [isLogin]);

  return (
    <>
      <Navbar onLogOut={handleLogout} isLogin={isLogin} toggleState={handleToggle} />
      <Routes>
        <Route element={<Home />} path='/' />
        <Route element={<About />} path='/about' />
        {/* <Route element={<ForgotPasswordPage />} path='/forgot-password' /> */}
        <Route element={<Contact />} path='/contact' />
        <Route element={<LearnMore />} path='/learn-more' />
        <Route
          element={<LoginAndSignUp userError={userError} formik={formik} toggleState={handleToggle} isLogin={isLogin} />}
          path='/login-signup'
        />
        <Route
          element={<RegisterPasskey formik={formik.values} loginUser={loginUser} registerPasskey={registerPasskey} signUpUser={signUpUser} />}
          path='/register-passkey'
        />
        <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path='/dashboard/:userId' />
        <Route element={<FourOFour />} path='*' />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

