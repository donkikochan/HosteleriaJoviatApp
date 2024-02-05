import firebase from "@react-native-firebase/app";

const FirebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default FirebaseConfig;
