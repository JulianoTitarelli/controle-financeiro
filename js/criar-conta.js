javascript
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyDw6y1sqRa6P-BAY2KkNXz7GYg3bEo",

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

const confirmarSenha =
    document.getElementById(
        "confirmarSenha"
    );

const criarConta =
    document.getElementById(
        "criarConta"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


criarConta.addEventListener(
    "click",
    async () => {

        const emailInformado =
            email.value.trim();

        const senhaInformada =
            senha.value;

        const confirmacao =
            confirmarSenha.value;


        mensagem.textContent = "";


        if (!emailInformado) {

            mensagem.textContent =
                "Digite seu e-mail.";

            return;
        }


        if (
            senhaInformada.length < 6
        ) {

            mensagem.textContent =
                "A senha deve ter pelo menos 6 caracteres.";

            return;
        }


        if (
            senhaInformada !==
            confirmacao
        ) {

            mensagem.textContent =
                "As senhas não são iguais.";

            return;
        }


        try {

            await createUserWithEmailAndPassword(
                auth,
                emailInformado,
                senhaInformada
            );


            alert(
                "Conta criada com sucesso!"
            );


            window.location.href =
                "login.html";


        } catch (erro) {

            console.error(erro);


            if (
                erro.code ===
                "auth/email-already-in-use"
            ) {

                mensagem.textContent =
                    "Este e-mail já está cadastrado.";

            } else if (
                erro.code ===
                "auth/invalid-email"
            ) {

                mensagem.textContent =
                    "Digite um e-mail válido.";

            } else if (
                erro.code ===
                "auth/weak-password"
            ) {

                mensagem.textContent =
                    "A senha é muito fraca.";

            } else {

                mensagem.textContent =
                    "Não foi possível criar a conta.";
            }

        }

    }
);

