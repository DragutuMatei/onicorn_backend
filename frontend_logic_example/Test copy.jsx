import React, { useEffect, useState } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useParams } from "react-router-dom";

const axx = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

const firebaseConfig = {
  apiKey: "AIzaSyAkZKiZbodKgA6Kg-tmGxnpUEVF4ly8EfI",
  authDomain: "onicorn-bdf8b.firebaseapp.com",
  projectId: "onicorn-bdf8b",
  storageBucket: "onicorn-bdf8b.firebasestorage.app",
  messagingSenderId: "742812011300",
  appId: "1:742812011300:web:1a8025912899b1fc5641b1",
  measurementId: "G-8M892HTVKN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Testcopy() {
  const { id } = useParams();
  const [proj, setProj] = useState();
  const getProj = async () => {
    await axx.get(`/getProjectById/${id}`).then((res) => {
      setProj(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getProj();
  }, []);
  return (
    <>
      <br /> <br />
      <br />
      <br />
      <br />
      <br />
      <h4 style={{ color: "#F9F6EE" }}>{JSON.stringify(proj)}</h4>
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Testcopy;
