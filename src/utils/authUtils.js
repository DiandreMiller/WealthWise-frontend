import axios from 'axios';
import { base64ToArrayBuffer } from './arrayBufferUtils';

const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${backEndUrl}/sign-up`, userData);
    if (response.data && response.data.message === "User created") {
      console.log('Sign-up successful:', response.data.user); 
      return response.data.user;
    }
    throw new Error("Sign-up failed. Please try again.");
  } catch (error) {
    console.error('Error during sign-up:', error); 
    throw error.response?.data?.message || error.message;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${backEndUrl}/sign-in`, userData);
    if (response.data && response.data.message === "Sign in is a success") {
      console.log('Login successful:', response.data); 
      return {
        token: response.data.token,
        userId: response.data.user.id,
        email: response.data.email,
        expiresIn: response.data.expiresIn,
        hasRegisteredPasskey: response.data.hasRegisteredPasskey,
      };
    }
    throw new Error("Login failed. Please try again.");
  } catch (error) {
    console.error('Error during login:', error); 
    throw error.response?.data?.message || error.message;
  }
};

export const registerPasskey = async (userId, email) => {
  console.log('registerPasskey called with:', { userId, email }); 

  if (!userId || !email) {
    console.error('Invalid parameters passed to registerPasskey:', { userId, email });
    throw new Error('User ID or Email is undefined (Register Passkey)!');
  }

  try {
    const response = await axios.post(`${backEndUrl}/register-passkey`, { userId, email });
    console.log('Response from /register-passkey:', response.data); 

    const publicKeyCredentialCreationOptions = response.data;

    const challengeBuffer = base64ToArrayBuffer(publicKeyCredentialCreationOptions.challenge);
    console.log('Transformed challenge buffer:', challengeBuffer); 

    publicKeyCredentialCreationOptions.challenge = challengeBuffer;
    publicKeyCredentialCreationOptions.user.id = new TextEncoder().encode(userId);
    console.log('Encoded user ID:', publicKeyCredentialCreationOptions.user.id); 

    const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
    console.log('Generated credential:', credential); 

    const webauthnid = credential.id;
    const webauthnpublickey = credential.rawId;

    console.log('Credential ID and public key:', { webauthnid, webauthnpublickey });

    await axios.post(`${backEndUrl}/verify-passkey`, {
      credential,
      email,
      userId,
      webauthnid,
      webauthnpublickey,
    });

    console.log('Passkey registration verified successfully'); 
    return { webauthnid, webauthnpublickey };
  } catch (error) {
    console.error('Error during registerPasskey:', error); 
    throw error.response?.data?.message || error.message;
  }
};
