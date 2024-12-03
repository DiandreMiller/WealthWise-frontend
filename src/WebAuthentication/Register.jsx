import { useState } from 'react';
import { client } from '@passwordless-id/webauthn';
import axios from 'axios';  

const Registration = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistration = async (event) => {
    event.preventDefault();

    try {
      //Request a challenge from the server
      const challengeResponse = await axios.post('/generate-challenge', {
         username,
      });
      const challenge = challengeResponse.data.challenge;

      // Create a unique ID for the user
      const userId = new TextEncoder().encode(username);

      //Trigger registration in the browser using WebAuthn
      const registration = await client.register({
        user: {
          id: userId, 
          name: username, 
          displayName: username, 
        },
        challenge: challenge, 
        // Optional configurations
        hints: ['client-device', 'security-key'],
        userVerification: 'preferred',
        discoverable: 'preferred',
        timeout: 60000,  
        attestation: true,
        domain: window.location.hostname,
      });

      //Send the registration data back to the server
      await axios.post('/register-passkey', { registration, username });

      // Mark the user as registered in the frontend
      setIsRegistered(true);
      setError(null);

    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Register with WebAuthn</h1>
      {isRegistered ? (
        <p>Registration successful!</p>
      ) : (
        <form onSubmit={handleRegistration}>
          <label htmlFor="username">Enter your username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Registration;
