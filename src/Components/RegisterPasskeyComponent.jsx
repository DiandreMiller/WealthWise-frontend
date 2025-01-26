import { useState } from "react";
import wealthWise from '../assets/wealthWise.png';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';

const RegisterPasskeyComponent = ({ registerPasskey }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email } = location.state || { userId: '', email: '' };
  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;
 
//   console.log("Registering passkey with userId:", userId, "and email:", email);

  const handleRegisterPasskey = async (event) => {
    event.preventDefault(); 

    // Check if userId and email are defined before proceeding
    if (!userId || !email) {
    //   console.log('Location state:', location.state);
      console.error('User ID or Email is undefined!');
      setError('User ID or Email is required for registration.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${backEndUrl}/register-passkey` , { identifier: email });
      const options = response.data;
      console.log('options:', options);

      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      console.log('challenge:', options.challenge);
      options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));
      console.log('options user id:', options.user.id);

      // Create the credential using the WebAuthn API
      const credential = await navigator.credentials.create({ publicKey: options });
      // console.log('Credential:', credential);

      // RegisterPasskey prop 
      await registerPasskey({userId, email, credential }); 

      // Verify the credential with the backend
      await axios.post(`${backEndUrl}/verify-passkey`, {userId, email, credential });
      navigate(`/dashboard/${userId}`);  
    } catch (err) {
      console.error('Error during passkey registration:', err);
      setError('Failed to register passkey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white mt-10">
      <header className="flex flex-col items-center justify-center pt-16">
        <img src={wealthWise} alt="Red Canary" className="w-48 mb-6" />
        <h1 className="text-4xl font-bold">Login With Your Passkey</h1>
        <p className="text-lg text-red-500 mt-2">Enhance Your Security</p>
      </header>

      <main className="flex flex-col items-center justify-center text-center flex-grow px-4 py-12">
        <section className="max-w-3xl mb-12">
          <h2 className="text-3xl font-semibold mb-6">Secure Your Account</h2>
          <p className="text-lg">
            Logging in with a passkey adds an extra layer of security to your account.
            Click the button below to log in with your passkey.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          {loading && <p>Loading...</p>}
        </section>

        <section className="mb-16 flex space-x-4">
          <button
            onClick={handleRegisterPasskey}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white text-lg py-2 px-6 rounded-full transition-all duration-300 min-w-[160px] text-center"
          >
            Login In With Passkey
          </button>
        </section>
      </main>
    </div>
  );
};

RegisterPasskeyComponent.propTypes = {
  registerPasskey: PropTypes.func.isRequired
};

export default RegisterPasskeyComponent;
