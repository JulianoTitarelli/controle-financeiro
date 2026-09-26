import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyDw6y1sqRa6P-BAY2KE22KkNXz7GYg3bEo",

    authDomain:
        "controle-financeiro-f6df9.firebaseapp.com",

    projectId:
        "controle-financeiro-f6df9",

    storageBucket:
        "controle-financeiro-f6df9.firebasestorage.app",

    messagingSenderId:
        "829663947104",

    appId:
        "1:829663947104:web:e114bd130737161ce65605"

};


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);


const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const entrar =
    document.getElementById("entrar");

const mensagem =
    document.getElementById("mensagem");


entrar.addEventListener(
    "click",
    async () => {

        const emailInformado =
            email.value.trim();

        const senhaInformada =
            senha.value;


        mensagem.textContent = "";


        if (!emailInformado) {

            mensagem.textContent =
                "Digite seu e-mail.";

            return;
        }


        if (!senhaInformada) {

            mensagem.textContent =
                "Digite sua senha.";

            return;
        }


        try {

            await signInWithEmailAndPassword(
                auth,
                emailInformado,
                senhaInformada
            );


            window.location.href =
                "index.html";


        } catch (erro) {

            console.error(erro);


            if (
                erro.code ===
                "auth/invalid-credential"
            ) {

                mensagem.textContent =
                    "E-mail ou senha incorretos.";

            } else if (
                erro.code ===
                "auth/user-not-found"
            ) {

                mensagem.textContent =
                    "Usuário não encontrado.";

            } else if (
                erro.code ===
                "auth/wrong-password"
            ) {

                mensagem.textContent =
                    "Senha incorreta.";

            } else {

                mensagem.textContent =
                    "Não foi possível entrar.";
            }

        }

    }
);
