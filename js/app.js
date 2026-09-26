import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


console.log("Firebase conectado!");
console.log(db);


const botaoTeste = document.getElementById("testeFirebase");


botaoTeste.addEventListener("click", async () => {

    try {

        await addDoc(
            collection(db, "entradas"),
            {
                descricao: "Teste do sistema",
                valor: 10,
                data: new Date(),
                status: "recebido"
            }
        );

        alert("Entrada salva com sucesso!");

    } catch (erro) {

        console.error("Erro ao salvar:", erro);

        alert("Erro ao salvar no Firebase.");

    }

});
