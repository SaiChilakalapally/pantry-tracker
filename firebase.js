// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIgwM6fPbouHANZy0pw_3K5PO53kG7mfc",
  authDomain: "pantry-tracker-6389c.firebaseapp.com",
  projectId: "pantry-tracker-6389c",
  storageBucket: "pantry-tracker-6389c.appspot.com",
  messagingSenderId: "196742091299",
  appId: "1:196742091299:web:5e219168bf509257981796",
  measurementId: "G-8WHZV0TF38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore ,auth };