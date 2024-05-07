// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVkiRhKmtsdKGjquaocKjPiTJbatyy3T0",
  authDomain: "readmeasy.firebaseapp.com",
  projectId: "readmeasy",
  storageBucket: "readmeasy.appspot.com",
  messagingSenderId: "713645877469",
  appId: "1:713645877469:web:7a2b862460d31849e91334",
  measurementId: "G-MKS1LNYXWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);