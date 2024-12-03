import { useState } from 'react';
import { fido2Get, fido2Create } from '@ownid/webauthn';
import axios from 'axios';


const WebAuthentication = () => {
    const [username, setUsername] = useState('');
    const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

    const handleSignIn = async () => {
        const response = await axios.post(`${backEndUrl}/sign-in`, { username });
        const { challenge } = response.data;
    
        // Use fido2Get to authenticate the user
        const result = await fido2Get(challenge);
        
        // Send the result to the backend for verification
        const signInCompleteResponse = await axios.post('/sign-in-complete', {
            username,
            data: result,
        });
    
        console.log(signInCompleteResponse.data);
    };
    

    const handleSignUp = async () => {
        const response = await axios.post('/sign-up', { username });
        const { challenge } = response.data;
    
        // Use fido2Create to register the user
        const result = await fido2Create(challenge);
        
        // Send the result to the backend for verification
        const signUpCompleteResponse = await axios.post('/sign-up-complete', {
            username,
            data: result,
        });
    
        console.log(signUpCompleteResponse.data);
    };
    

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default WebAuthentication;
