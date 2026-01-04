// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.firebasestorage.app",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed",
  measurementId: "G-C863LK8YNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
