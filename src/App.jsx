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
// import { UserProvider } from './Context/UserContext';

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
import TestComponent from './Components/TestComponent';
import PlaceHolderSubmittedContactUs from './Pages/PlaceHolderSubmittedContactUs';
import ForgotPassword1 from './Pages/ForgotPassword1';
import ResetPassword from './Pages/ResetPassword';
import FinancialComponent from './Components/FinancialComponent';


const AppContent = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [isLogin, setIsLogin] = useState(true);
  // eslint-disable-next-line no-use-before-define
  const [userError, setUserError] = useState('');
  const [userId, setUserId] = useState(null);
  const { login, logout, reset } = useAuth();
  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  console.log('backEndUrl:', backEndUrl);
  // const encodedUrl = btoa(userId);


  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const currentUserId = Cookies.get('userID');
    if(currentUserId) {
      setUserId(currentUserId);
    }
  },[])

  

  const signUpUser = async (userData) => {
    try {
      const response = await axios.post(`${backEndUrl}/sign-up`, userData);
      console.log('Sign-up response:', response.data);
      
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
    console.log('message:', response.data.message);
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
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.error || 'Invalid Credentials. Please try again.';
    setUserError(errorMessage); 
    console.log('Updated userError state:', errorMessage);
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
        console.log('token:', token);
  
        if (token) {
          if (!expiresIn) {
            console.error('Token expiration not found in login response. Cannot set token.');
            throw new Error('Token expiration not found in login response. Cannot set token.');
          }
          const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
          // console.log('Expiration date:', expirationDate);
          Cookies.set('token', token, { expires: expirationDate, secure: true, sameSite: 'strict' });
          // console.log('Token:', token);
          Cookies.set('userID', response.userId, { expires: expirationDate, secure: true, sameSite: 'strict' });
          // console.log('userId in app.js:', userId);
          login(token);
          setUserId(response.userId);
          if (!hasRegisteredPasskey) {
            navigate('/register-passkey', { state: { userId: response.userId, email: sanitizedValues.email } });
          } else {
            navigate(`/dashboard/${response.userId}`);
            
          }
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        // setUserError(error.response?.data?.error);
      }
    },
  });
  

    // Logout function
    const handleLogout = () => {
      Cookies.remove('token', { secure: true, sameSite: 'strict' });
      Cookies.remove('userID', { secure: true, sameSite: 'strict' });
      logout(); 
      reset(); 
      setUserId(null);
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
    
      {/* <UserProvider> */}
          <Navbar onLogOut={handleLogout} isLogin={isLogin} toggleState={handleToggle} userId={userId} 
          darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {/* </UserProvider> */}

      <Routes>
        <Route element={<Home darkMode={darkMode} />} path='/' />
        <Route element={<About darkMode={darkMode} />} path='/about' />
        <Route element={<ForgotPassword1 darkMode={darkMode} />} path='/forgot-password' />
        <Route element={<ResetPassword darkMode={darkMode} />} path='/reset-password' />
        <Route element={<Contact darkMode={darkMode} />} path='/contact' />
        <Route element={<LearnMore darkMode={darkMode} />} path='/learn-more' />
        <Route element={<FinancialComponent />} path='/finances' />
        <Route
          element={<LoginAndSignUp userError={userError} formik={formik} toggleState={handleToggle} isLogin={isLogin} />}
          path='/login-signup'
        />
        <Route
          element={<RegisterPasskey formik={formik.values} loginUser={loginUser} registerPasskey={registerPasskey} signUpUser={signUpUser} />}
          path='/register-passkey'
        />
        <Route element={<PlaceHolderSubmittedContactUs />} path='/thank-you-for-contacting-us' />
        <Route element={<TestComponent />} path='/test/:userId'/>
        <Route element={<ProtectedRoute><Dashboard darkMode={darkMode} /></ProtectedRoute>} path='/dashboard/:userId' />
        {/* <Route element={<ProtectedRoute><Dashboard darkMode={darkMode} /></ProtectedRoute>} path={`/dashboard/${encodedUrl}`} /> */}
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

