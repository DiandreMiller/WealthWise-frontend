import axios from 'axios';
import { base64ToArrayBuffer } from './arrayBufferUtils';

const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${backEndUrl}/sign-up`, userData);
    if (response.data && response.data.message === "User created") {
      return response.data.user;
    }
    throw new Error("Sign-up failed. Please try again.");
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${backEndUrl}/sign-in`, userData);
    if (response.data && response.data.message === "Sign in is a success") {
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
    throw error.response?.data?.message || error.message;
  }
};

export const registerPasskey = async (userId, email) => {
  if (!userId || !email) {
    throw new Error('User ID or Email is undefined!');
  }
  const response = await axios.post(`${backEndUrl}/register-passkey`, { userId, email });
  const publicKeyCredentialCreationOptions = response.data;

  const challengeBuffer = base64ToArrayBuffer(publicKeyCredentialCreationOptions.challenge);
  publicKeyCredentialCreationOptions.challenge = challengeBuffer;
  publicKeyCredentialCreationOptions.user.id = new TextEncoder().encode(userId);

  let credential;
  try {
    credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
  } catch (error) {
    throw error;
  }

  const webauthnid = credential.id;
  const webauthnpublickey = credential.rawId;

  await axios.post(`${backEndUrl}/verify-passkey`, {
    credential,
    email,
    userId,
    webauthnid,
    webauthnpublickey,
  });

  return { webauthnid, webauthnpublickey };
}; 