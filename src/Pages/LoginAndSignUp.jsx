import LoginAndSignUpComponent from '../Components/LoginAndSignUpComponent';
import PropTypes from 'prop-types';

const LoginAndSignUp = ({ formik, userError, toggleState, isLogin }) => {

    return (
        <div>
            <LoginAndSignUpComponent userError={userError} formik={formik} toggleState={toggleState} isLogin={isLogin} />
        </div>
    );

};

LoginAndSignUp.propTypes = {
    userError: PropTypes.string,
    registerPasskey: PropTypes.func,
    loginUser: PropTypes.func,
    signUpUser: PropTypes.func,
    formik: PropTypes.object,
    setIsLogin: PropTypes.func.isRequired,
    toggleLogin: PropTypes.func.isRequired,
    toggleState: PropTypes.func.isRequired,
    isLogin: PropTypes.bool.isRequired
};

export default LoginAndSignUp;