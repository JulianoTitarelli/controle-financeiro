import { db } from "./firebase.js";

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
const data = document.getElementById("data");
const salvarEntrada = document.getElementById("salvarEntrada");
const listaEntradas = document.getElementById("listaEntradas");


const entradasRef = collection(db, "entradas");



/* ========================================
   ADICIONAR ENTRADA
======================================== */

salvarEntrada.addEventListener("click", async () => {

    const nome = descricao.value.trim();
    const valorEntrada = Number(valor.value);
    const dataEntrada = data.value;


    if (!nome) {
        alert("Digite a descrição da entrada.");
        return;
    }


    if (!valorEntrada || valorEntrada <= 0) {
        alert("Digite um valor válido.");
        return;
    }


    if (!dataEntrada) {
        alert("Informe a data.");
        return;
    }


    try {

        await addDoc(entradasRef, {

            descricao: nome,
            valor: valorEntrada,
            data: dataEntrada,
            status: "a_receber",
            criadoEm: new Date()

        });


        alert("Entrada adicionada com sucesso!");


        descricao.value = "";
        valor.value = "";
        data.value = "";


        carregarEntradas();

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível salvar a entrada.");

    }

});



/* ========================================
   CARREGAR ENTRADAS
======================================== */

async function carregarEntradas() {

    listaEntradas.innerHTML = "<p>Carregando...</p>";


    try {

        const consulta = query(
            entradasRef,
            orderBy("data", "asc")
        );


        const resultado = await getDocs(consulta);


        listaEntradas.innerHTML = "";


        if (resultado.empty) {

            listaEntradas.innerHTML = `
                <p>Nenhuma entrada cadastrada.</p>
            `;

            return;
        }


        resultado.forEach((documento) => {

            const entrada = documento.data();


            const valorFormatado = Number(
                entrada.valor
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );


            const dataFormatada = new Date(
                entrada.data + "T00:00:00"
            ).toLocaleDateString("pt-BR");


            const card = document.createElement("div");

            card.className = "card-conta";


            card.innerHTML = `

                <h3>
                    ${entrada.descricao}
                </h3>

                <p>
                    ${valorFormatado}
                </p>

                <p>
                    Data: ${dataFormatada}
                </p>

                <p>
                    Status:
                    <strong>
                        ${
                            entrada.status === "recebido"
                                ? "RECEBIDO"
                                : "A RECEBER"
                        }
                    </strong>
                </p>


                ${
                    entrada.status === "a_receber"

                    ? `
                        <button
                            class="btn-pagar"
                        >
                            MARCAR COMO RECEBIDO
                        </button>
                    `

                    : `
                        <button
                            class="btn-desfazer"
                        >
                            VOLTAR PARA A RECEBER
                        </button>
                    `
                }


                <button
                    class="btn-excluir"
                >
                    EXCLUIR
                </button>

            `;


            const botaoStatus =
                card.querySelector(
                    ".btn-pagar, .btn-desfazer"
                );


            botaoStatus.addEventListener(
                "click",
                () => alterarStatus(
                    documento.id,
                    entrada.status
                )
            );


            const botaoExcluir =
                card.querySelector(
                    ".btn-excluir"
                );


            botaoExcluir.addEventListener(
                "click",
                () => excluirEntrada(
                    documento.id,
                    entrada.descricao
                )
            );


            listaEntradas.appendChild(card);

        });


    } catch (erro) {

        console.error(erro);

        listaEntradas.innerHTML = `
            <p>
                Erro ao carregar as entradas.
            </p>
        `;

    }

}



/* ========================================
   ALTERAR STATUS
======================================== */

async function alterarStatus(
    id,
    statusAtual
) {

    const novoStatus =
        statusAtual === "a_receber"
            ? "recebido"
            : "a_receber";


    try {

        await updateDoc(
            doc(db, "entradas", id),
            {
                status: novoStatus
            }
        );


        carregarEntradas();


    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível alterar o status."
        );

    }

}



/* ========================================
   EXCLUIR ENTRADA
======================================== */

async function excluirEntrada(
    id,
    descricaoEntrada
) {

    const confirmar = confirm(
        `Deseja realmente excluir a entrada "${descricaoEntrada}"?`
    );


    if (!confirmar) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "entradas", id)
        );


        alert(
            "Entrada excluída com sucesso!"
        );


        carregarEntradas();


    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível excluir a entrada."
        );

    }

}



carregarEntradas();
