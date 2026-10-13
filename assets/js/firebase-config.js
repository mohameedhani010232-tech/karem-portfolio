/**
 * Firebase Configuration & Initialization
 * SDK: Firebase v10 Modular CDN
 * 
 * Replace the values in `firebaseConfig` with your actual project keys
 * from Firebase Console (Project Settings > General > Your apps > Web app)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
    deleteObject 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ============================================================================
// ⚠️ ضع إعدادات Firebase الخاصة بك هنا (من Firebase Console)
// ============================================================================
export const firebaseConfig = {
    apiKey: "AIzaSyDt-swNw7vVmHnKQap2AoSSmiKuPr_8eyY",
    authDomain: "full-stack-52277.firebaseapp.com",
    projectId: "full-stack-52277",
    storageBucket: "full-stack-52277.firebasestorage.app",
    messagingSenderId: "345357721574",
    appId: "1:345357721574:web:646e99b0924d69f60f4027",
    measurementId: "G-L2XWLJBWFK"
};

// Check if credentials have been replaced
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

// Initialize Firebase safely
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
    if (isFirebaseConfigured()) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } else {
        console.warn("⚠️ Firebase is not configured yet. Please add your credentials in assets/js/firebase-config.js");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

export {
    app,
    auth,
    db,
    storage,
    // Auth functions
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    // Firestore functions
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    // Storage functions
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
};
