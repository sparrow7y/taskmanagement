// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBDbKT-Mlw-2-5YZwyo7AoDZhPOZbkdFM",
  authDomain: "task-management-9bc49.firebaseapp.com",
  projectId: "task-management-9bc49",
  storageBucket: "task-management-9bc49.firebasestorage.app",
  messagingSenderId: "608780992030",
  appId: "1:608780992030:web:9fe6d5dce28e3e2c28f80f",
  measurementId: "G-JM2PG0BJM4"
};

// Sdk admin firebase
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
  
  import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const db = getFirestore(app);

// When already logged in, redirect to tasks page
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (user && (path.endsWith("index.html") || path.endsWith("register.html"))) {
    window.location.href = "tasks.html";
  }
});

// register
const registerForm   = document.getElementById("register-form");
const registerError  = document.getElementById("register-error");
const registerSubmit = document.getElementById("register-submit");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!registerSubmit) {
      return;
    }
    registerError.textContent = "error";
    registerSubmit.disabled = true;
    try {
      const email    = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        createdAt: serverTimestamp()
      });

      window.location.href = "tasks.html";
    } catch (err) {
      registerError.textContent = err.message;
      console.error(err);
    } finally {
      registerSubmit.disabled = false;
    }
  });
}

// Login
const loginForm   = document.getElementById("login-form");
const loginError  = document.getElementById("login-error");
const loginSubmit = document.getElementById("login-submit");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!loginSubmit) {
      return;
    }
    loginError.textContent = "error";
    loginSubmit.disabled = true;

    try {
      const email    = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "tasks.html";
    } catch (err) {
      loginError.textContent = err.message;
      console.error(err);
    } finally {
      loginSubmit.disabled = false;
    }
  });
}