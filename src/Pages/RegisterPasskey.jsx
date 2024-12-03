import RegisterPasskeyComponent from "../Components/RegisterPasskeyComponent";
import PropTypes from 'prop-types';

const RegisterPasskey = ({formik, registerPasskey, signUpUser, loginUser}) => {

    return (
        <div>
            <RegisterPasskeyComponent formik={formik} registerPasskey={registerPasskey} signUpUser={signUpUser} loginUser={loginUser} />
        </div>
    )
};

RegisterPasskey.propTypes = {
    formik: PropTypes.object.isRequired,
    registerPasskey: PropTypes.func.isRequired,
    signUpUser: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired
};

export default RegisterPasskey;