import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgPdFoAXsEfMELC_6rvmICsXFWemSkZy0",
  authDomain: "hosteleria-app-joviat.firebaseapp.com",
  projectId: "hosteleria-app-joviat",
  storageBucket: "hosteleria-app-joviat.appspot.com",
  messagingSenderId: "510663146644",
  appId: "1:510663146644:web:e924f3e20032c409054881",
  measurementId: "G-X1W5ZH7B43",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, auth };
