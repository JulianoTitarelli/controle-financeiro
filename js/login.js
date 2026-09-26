import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyC7HSt6-NcB1ljU53IUXAhlnichQ2hCI0s",
    authDomain: "controle-financeiro-f6df9.firebaseapp.com",
    projectId: "controle-financeiro-f6df9",
    storageBucket: "controle-financeiro-f6df9.firebasestorage.app",
    messagingSenderId: "829663947104",
    appId: "1:829663947104:web:e114bd130737161ce65605"
};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provedorGoogle = new GoogleAuthProvider();


const email = document.getElementById("email");

const senha = document.getElementById("senha");

const entrar = document.getElementById("entrar");

const google = document.getElementById("google");

const mensagem = document.getElementById("mensagem");


/* ========================= */
/* LOGIN COM E-MAIL */
/* ========================= */

entrar.addEventListener("click", async () => {

    const emailInformado = email.value.trim();

    const senhaInformada = senha.value;

    mensagem.textContent = "";


    if (!emailInformado) {

        mensagem.textContent = "Digite seu e-mail.";

        return;
    }


    if (!senhaInformada) {

        mensagem.textContent = "Digite sua senha.";

        return;
    }


    try {

        await signInWithEmailAndPassword(
            auth,
            emailInformado,
            senhaInformada
        );


        window.location.href = "index.html";


    } catch (erro) {

        console.error(erro);


        if (erro.code === "auth/invalid-credential") {

            mensagem.textContent =
                "E-mail ou senha incorretos.";

        } else if (erro.code === "auth/user-not-found") {

            mensagem.textContent =
                "Usuário não encontrado.";

        } else if (erro.code === "auth/wrong-password") {

            mensagem.textContent =
                "Senha incorreta.";

        } else {

            mensagem.textContent =
                "Não foi possível entrar.";
        }
    }

});


/* ========================= */
/* LOGIN COM GOOGLE */
/* ========================= */

google.addEventListener("click", async () => {

    mensagem.textContent = "";


    try {

        await signInWithPopup(
            auth,
            provedorGoogle
        );


        window.location.href = "index.html";


    } catch (erro) {

        console.error(erro);


        if (erro.code === "auth/popup-closed-by-user") {

            mensagem.textContent =
                "O login com Google foi cancelado.";

        } else if (erro.code === "auth/popup-blocked") {

            mensagem.textContent =
                "O navegador bloqueou a janela do Google.";

        } else if (erro.code === "auth/unauthorized-domain") {

            mensagem.textContent =
                "Este domínio não está autorizado no Firebase.";

        } else if (erro.code === "auth/operation-not-allowed") {

            mensagem.textContent =
                "O login com Google não está ativado no Firebase.";

        } else {

            mensagem.textContent =
                "Não foi possível entrar com o Google.";
        }
    }

}
);

