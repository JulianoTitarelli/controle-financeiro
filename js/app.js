```javascript
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
    document.getElementById("totalContasPagas");

const totalPendentes =
    document.getElementById("totalPendentes");

const saldoFuturo =
    document.getElementById("saldoFuturo");

const listaProximasContas =
    document.getElementById("listaProximasContas");



/* ========================================
   FORMATAR MOEDA
======================================== */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



/* ========================================
   FORMATAR DATA
======================================== */

function formatarData(data) {

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );

}



/* ========================================
   CARREGAR RESUMO
======================================== */

async function carregarResumo() {

    try {

        const entradasSnapshot =
            await getDocs(
                collection(db, "entradas")
            );


        const contasSnapshot =
            await getDocs(
                collection(db, "contas")
            );


        let entradasRecebidas = 0;

        let contasPagas = 0;

        let contasPendentes = 0;


        const contasPendentesLista = [];


        /* ========================= */
        /* ENTRADAS */
        /* ========================= */

        entradasSnapshot.forEach(
            (documento) => {

                const entrada =
                    documento.data();


                if (
                    entrada.status === "recebido"
                ) {

                    entradasRecebidas +=
                        Number(
                            entrada.valor
                        );

                }

            }
        );


        /* ========================= */
        /* CONTAS */
        /* ========================= */

        contasSnapshot.forEach(
            (documento) => {

                const conta =
                    documento.data();


                if (
                    conta.status === "pago"
                ) {

                    contasPagas +=
                        Number(
                            conta.valor
                        );

                }


                if (
                    conta.status === "pendente"
                ) {

                    contasPendentes +=
                        Number(
                            conta.valor
                        );


                    contasPendentesLista.push({

                        id: documento.id,

                        descricao:
                            conta.descricao,

                        valor:
                            Number(
                                conta.valor
                            ),

                        vencimento:
                            conta.vencimento

                    });

                }

            }
        );


        /* ========================= */
        /* CÁLCULOS */
        /* ========================= */

        const saldo =
            entradasRecebidas -
            contasPagas;


        const saldoDepoisContas =
            saldo -
            contasPendentes;


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


        /* ========================= */
        /* PRÓXIMAS CONTAS */
        /* ========================= */

        contasPendentesLista.sort(
            (a, b) =>
                a.vencimento.localeCompare(
                    b.vencimento
                )
        );


        const proximas =
            contasPendentesLista.slice(
                0,
                5
            );


        listaProximasContas.innerHTML =
            "";


        if (proximas.length === 0) {

            listaProximasContas.innerHTML = `
                <p class="sem-contas">
                    Nenhuma conta pendente.
                </p>
            `;

        } else {

            proximas.forEach(
                (conta) => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "card-proxima-conta";


                    card.innerHTML = `

                        <div>

                            <h3>
                                ${conta.descricao}
                            </h3>

                            <p>
                                Vencimento:
                                ${formatarData(
                                    conta.vencimento
                                )}
                            </p>

                        </div>


                        <strong>
                            ${formatarMoeda(
                                conta.valor
                            )}
                        </strong>

                    `;


                    listaProximasContas
                        .appendChild(card);

                }
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar resumo:",
            erro
        );


        listaProximasContas.innerHTML = `
            <p class="sem-contas">
                Não foi possível carregar as contas.
            </p>
        `;

    }

}



carregarResumo();
```
