import { db, auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const vencimento = document.getElementById("vencimento");
const salvarConta = document.getElementById("salvarConta");
const listaContas = document.getElementById("listaContas");


const contasRef = collection(db, "contas");



/* ========================================
   ADICIONAR CONTA
======================================== */

salvarConta.addEventListener("click", async () => {

    const nome = descricao.value.trim();
    const valorConta = Number(valor.value);
    const dataVencimento = vencimento.value;


    if (!nome) {
        alert("Digite a descrição da conta.");
        return;
    }


    if (!valorConta || valorConta <= 0) {
        alert("Digite um valor válido.");
        return;
    }


    if (!dataVencimento) {
        alert("Informe o vencimento.");
        return;
    }


    try {

        await addDoc(contasRef, {

            descricao: nome,
            valor: valorConta,
            vencimento: dataVencimento,
            status: "pendente",
            criadoEm: new Date()

        });


        alert("Conta adicionada com sucesso!");


        descricao.value = "";
        valor.value = "";
        vencimento.value = "";


        carregarContas();

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível salvar a conta.");

    }

});



/* ========================================
   CARREGAR CONTAS
======================================== */

async function carregarContas() {

    listaContas.innerHTML = "<p>Carregando...</p>";


    try {

        const consulta = query(
            contasRef,
            orderBy("vencimento", "asc")
        );


        const resultado = await getDocs(consulta);


        listaContas.innerHTML = "";


        if (resultado.empty) {

            listaContas.innerHTML = `
                <p>Nenhuma conta cadastrada.</p>
            `;

            return;
        }


        resultado.forEach((documento) => {

            const conta = documento.data();


            const valorFormatado = Number(
                conta.valor
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );


            const dataFormatada = new Date(
                conta.vencimento + "T00:00:00"
            ).toLocaleDateString("pt-BR");


            const card = document.creat
