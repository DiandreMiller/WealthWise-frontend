import { useState } from 'react';
import SignUpComponent from "../Components/SignUpComponent";
import PropTypes from 'prop-types';

const SignUp = ({ formik, userError }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div>
      <SignUpComponent
        formik={formik}
        userError={userError}
        togglePasswordVisibility={togglePasswordVisibility}
        showPassword={showPassword}
      />
    </div>
  );
};

SignUp.propTypes = {
  formik: PropTypes.shape({
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object
  }).isRequired,
  userError: PropTypes.string
};

export default SignUp;
