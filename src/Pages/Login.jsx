import { useState } from 'react';
import LoginComponent from "../Components/LoginComponent";
import PropTypes from 'prop-types';
import { useAuth } from '../authentication/AuthContext';

const Login = ({ userError, formik, registerPasskey, loginUser, signUpUser }) => {
  const { isLogin, toggleAuthState } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div>
      <LoginComponent
        userError={userError}
        formik={formik}
        registerPasskey={registerPasskey}
        loginUser={loginUser}
        signUpUser={signUpUser}
        togglePasswordVisibility={togglePasswordVisibility}
        showPassword={showPassword}
        toggleAuthState={toggleAuthState}
        isLogin={isLogin}
      />
    </div>
  );
};

Login.propTypes = {
  userError: PropTypes.string,
  formik: PropTypes.object,
  registerPasskey: PropTypes.func,
  loginUser: PropTypes.func,
  signUpUser: PropTypes.func
};

export default Login;
