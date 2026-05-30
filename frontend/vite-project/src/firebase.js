import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSmUzOIamxcHXGgtlIyjzodbrV_2xGUGg",
  authDomain: "servenow-e4058.firebaseapp.com",
  projectId: "servenow-e4058",
  storageBucket: "servenow-e4058.firebasestorage.app",
  messagingSenderId: "334567612073",
  appId: "1:334567612073:web:dc82ff640932f57a8853b8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const setupRecaptcha = () => {

  if (!window.recaptchaVerifier) {

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  }

  return window.recaptchaVerifier;
};

export { signInWithPhoneNumber };