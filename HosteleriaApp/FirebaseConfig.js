// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgPdFoAXsEfMELC_6rvmICsXFWemSkZy0",
  authDomain: "hosteleria-app-joviat.firebaseapp.com",
  projectId: "hosteleria-app-joviat",
  storageBucket: "hosteleria-app-joviat.appspot.com",
  messagingSenderId: "510663146644",
  appId: "1:510663146644:web:e924f3e20032c409054881",
  measurementId: "G-X1W5ZH7B43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);