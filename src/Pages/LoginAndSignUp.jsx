import LogInAndSignUpComponent from '../Components/LogInAndSignUpComponent';
import PropTypes from 'prop-types';

const LoginAndSignUp = ({ userError, registerPasskey, loginUser, signUpUser, formik }) => {

    return (
        <div>
            <LogInAndSignUpComponent userError={userError} formik={formik} registerPasskey={registerPasskey} loginUser={loginUser} signUpUser={signUpUser}/>
        </div>
    );

};

LoginAndSignUp.propTypes = {
    userError: PropTypes.string,
    registerPasskey: PropTypes.func,
    loginUser: PropTypes.func,
    signUpUser: PropTypes.func,
    formik: PropTypes.object
};

export default LoginAndSignUp;