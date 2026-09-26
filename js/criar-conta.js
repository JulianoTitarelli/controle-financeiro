javascript
import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const confirmarSenha =
    document.getElementById("confirmarSenha");

const criarConta =
    document.getElementById("criarConta");

const mensagem =
    document.getElementById("mensagem");


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


        if (senhaInformada.length < 6) {

            mensagem.textContent =
                "A senha deve ter pelo menos 6 caracteres.";

            return;
        }


        if (senhaInformada !== confirmacao) {

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

