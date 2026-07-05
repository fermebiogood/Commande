import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi2KPKNYHeiydvDT9w2PsRJ9hFG1mQR6I",
  authDomain: "ferme-biogood.firebaseapp.com",
  projectId: "ferme-biogood",
  storageBucket: "ferme-biogood.firebasestorage.app",
  messagingSenderId: "46147540400",
  appId: "1:46147540400:web:22638d8faa927a0471f275"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Firestore (base de données)
export const db = getFirestore(app);