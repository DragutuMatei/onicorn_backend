// firebase.js
// const admin = require("firebase-admin");
// const serviceAccount = require("./onicorn.json");
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./onicorn.json" with { type: "json" };
import { getFirestore } from "firebase-admin/firestore";
import { cert, initializeApp } from "firebase-admin/app";


initializeApp({
  credential:cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();
export { auth, db };