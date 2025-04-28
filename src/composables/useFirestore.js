import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-CFIXdCtF23ByWeax11fblvrOPA7HqWA",
  authDomain: "devgate-a3c31.firebaseapp.com",
  projectId: "devgate-a3c31",
  storageBucket: "devgate-a3c31.firebasestorage.app",
  messagingSenderId: "872918903142",
  appId: "1:872918903142:web:bbb5c5688ae8e59b9f00a7",
  measurementId: "G-CXQ6M5HBF7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };




