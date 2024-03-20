// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHMhU1Z0bYZtPL-A23jBiVtyYb_0pDLWE",
  authDomain: "checkit-ce473.firebaseapp.com",
  projectId: "checkit-ce473",
  storageBucket: "checkit-ce473.appspot.com",
  messagingSenderId: "1092234520209",
  appId: "1:1092234520209:web:ef7b70ee3f128253ac0130"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication, database
export const auth = getAuth(app);
export const datab = getFirestore(app);