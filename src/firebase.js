// src/firebase.js
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    signInAnonymously,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCG-t2iwSzV47c1p92_tYaowH-HG3htfAM",
    authDomain: "hora-beta.firebaseapp.com",
    projectId: "hora-beta",
    storageBucket: "hora-beta.firebasestorage.app",
    messagingSenderId: "421554741558",
    appId: "1:421554741558:web:6d2ab51e57d9e239375397",
    measurementId: "G-DJBEPRW33B",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
    auth,
    db,
    provider,
    signInAnonymously,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
};
