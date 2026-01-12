import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWaaBAxXlRk-ZyBfsZUSAysN6At_1f_po",
  authDomain: "netflix-clone-4b405.firebaseapp.com",
  projectId: "netflix-clone-4b405",
  storageBucket: "netflix-clone-4b405.firebasestorage.app",
  messagingSenderId: "579067836756",
  appId: "1:579067836756:web:9133aa2ccd507be30e70c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;