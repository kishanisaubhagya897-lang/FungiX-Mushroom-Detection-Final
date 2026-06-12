import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDEy2HIdzgNh1SwbxcnqQRqw96JfeOXRUs",
  authDomain: "fungix-app.firebaseapp.com",
  projectId: "fungix-app",
  storageBucket: "fungix-app.firebasestorage.app",
  messagingSenderId: "431323058403",
  appId: "1:431323058403:web:e45b8a5e6c6240b363b5d6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
