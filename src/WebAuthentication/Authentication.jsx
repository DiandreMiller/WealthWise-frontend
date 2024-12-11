import { useState } from 'react';
import { client } from '@passwordless-id/webauthn';
import axios from 'axios';  
import { useAuth } from '../authenthication/AuthContext';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthentication = async (e) => {
    e.preventDefault();

    try {
      //Request an authentication challenge from the server
      const response = await axios.post('/generate-challenge', {
        username,
      });

      const { challenge } = response.data;

      //Call the authenticate method
      const authentication = await client.authenticate({
        challenge,
        user: { id: username },
        timeout: 60000,  // Optional timeout (60 seconds)
        userVerification: 'preferred',  // Optional user verification level
      });

      // Send the authentication response to your server for verification
      const verificationResponse = await axios.post('/authenticate-passkey', {
        authentication,
      });

      const result = verificationResponse.data;

      if(result.success) {
        login(result.token);
        setMessage('Authentication successful');
        navigate('/register-passkey');
      } else {
        setMessage('Authentication failed');
      }


      setMessage('Authentication successful: ' + JSON.stringify(result));
    } catch (error) {
      setMessage('Authentication failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Authenticate</h2>
      <form onSubmit={handleAuthentication}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Authenticate</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Authentication;
