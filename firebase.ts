import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBtaxXoCzTRLmioK4kFnyt64Pun1gaGWUA",
  authDomain: "mention-ad8dd.firebaseapp.com",
  projectId: "mention-ad8dd",
  storageBucket: "mention-ad8dd.firebasestorage.app",
  messagingSenderId: "910372012949",
  appId: "1:910372012949:web:5a813413842e2b9dd56c9c",
  measurementId: "G-PLHQ11JGWQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
