import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAkZKiZbodKgA6Kg-tmGxnpUEVF4ly8EfI",
    authDomain: "onicorn-bdf8b.firebaseapp.com",
    projectId: "onicorn-bdf8b",
    storageBucket: "onicorn-bdf8b.firebasestorage.app",
    messagingSenderId: "742812011300",
    appId: "1:742812011300:web:1a8025912899b1fc5641b1",
    measurementId: "G-8M892HTVKN"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const datab = getFirestore(app);

// Export the initialized instances to use in other parts of your app
export { datab };