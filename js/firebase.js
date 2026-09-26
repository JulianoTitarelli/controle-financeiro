import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDw6y1sqRa6P-BAY2KE22KkNXz7GYg3bEo",
    authDomain: "controle-financeiro-f6df9.firebaseapp.com",
    projectId: "controle-financeiro-f6df9",
    storageBucket: "controle-financeiro-f6df9.firebasestorage.app",
    messagingSenderId: "829663947104",
    appId: "1:829663947104:web:e114bd130737161ce65605"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
