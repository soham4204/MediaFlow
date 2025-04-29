import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1Ezjfzx8UHHrsIEunQOxoOPXDVS5yw9E",
  authDomain: "mediaflow-1048f.firebaseapp.com",
  projectId: "mediaflow-1048f",
  storageBucket: "mediaflow-1048f.firebasestorage.app",
  messagingSenderId: "1015352244290",
  appId: "1:1015352244290:web:86beaaa243dff48338d5db",
  measurementId: "G-DK3TDMF2CK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;