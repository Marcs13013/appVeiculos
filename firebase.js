import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar getAuth

const firebaseConfig = {
    apiKey: "AIzaSyBHHsM1wEc_MhwuzWoWPA1eqkOrSswDRwc",
    authDomain: "veiculosapp-9a07c.firebaseapp.com",
    projectId: "veiculosapp-9a07c",
    storageBucket: "veiculosapp-9a07c.firebasestorage.app",
    messagingSenderId: "866456696745",
    appId: "1:866456696745:web:df698f5e857c05fb35b6b8"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app); // Exportar auth