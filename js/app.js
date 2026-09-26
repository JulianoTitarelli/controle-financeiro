import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const saldoAtual =
    document.getElementById("saldoAtual");

const totalEntradas =
    document.getElementById("totalEntradas");

const totalContasPagas =
    document.getElementById(
        "totalContasPagas"
    );

const totalPendentes =
    document.getElementById(
        "totalPendentes"
    );

const saldoFuturo =
    document.getElementById(
        "saldoFuturo"
    );


// ==============================
// FORMATA VALOR
// ==============================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==============================
// CARREGAR DADOS
// ==============================

async function carregarResumo() {

    try {

        const entradasSnapshot =
            await getDocs(
                collection(
                    db,
                    "entradas"
                )
            );


        const contasSnapshot =
            await getDocs(
                collection(
                    db,
                    "contas"
                )
            );


        let entradasRecebidas = 0;

        let contasPagas = 0;

        let contasPendentes = 0;


        // ==========================
        // ENTRADAS
        // ==========================

        entradasSnapshot.forEach(
            (documento) => {

                const entrada =
                    documento.data();


                if (
                    entrada.status ===
                    "recebido"
                ) {

                    entradasRecebidas +=
                        Number(
                            entrada.valor
                        );

                }

            }
        );


        // ==========================
        // CONTAS
        // ==========================

        contasSnapshot.forEach(
            (documento) => {

                const conta =
                    documento.data();


                if (
                    conta.status ===
                    "pago"
                ) {

                    contasPagas +=
                        Number(
                            conta.valor
                        );

                }


                if (
                    conta.status ===
                    "pendente"
                ) {

                    contasPendentes +=
                        Number(
                            conta.valor
                        );

                }

            }
        );


        // ==========================
        // CÁLCULOS
        // ==========================

        const saldo =
            entradasRecebidas -
            contasPagas;


        const saldoDepoisContas =
            saldo -
            contasPendentes;


        // ==========================
        // MOSTRAR NA TELA
        // ==========================

        totalEntradas.textContent =
            formatarMoeda(
                entradasRecebidas
            );


        totalContasPagas.textContent =
            formatarMoeda(
                contasPagas
            );


        totalPendentes.textContent =
            formatarMoeda(
                contasPendentes
            );


        saldoAtual.textContent =
            formatarMoeda(
                saldo
            );


        saldoFuturo.textContent =
            formatarMoeda(
                saldoDepoisContas
            );


    } catch (erro) {

        console.error(
            "Erro ao carregar resumo:",
            erro
        );

    }

}


// ==============================
// INICIAR
// ==============================

carregarResumo();
