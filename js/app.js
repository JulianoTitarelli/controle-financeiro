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

const listaHistorico =
    document.getElementById("listaHistorico");


function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function formatarData(data) {

    if (!data) {
        return "";
    }

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString("pt-BR");
}


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


        const listaContasPendentes = [];

        const historico = [];


        // =========================
        // ENTRADAS
        // =========================

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


                    historico.push({

                        tipo: "entrada",

                        descricao:
                            entrada.descricao,

                        valor:
                            Number(
                                entrada.valor
                            ),

                        data:
                            entrada.data

                    });

                }

            }
        );


        // =========================
        // CONTAS
        // =========================

        contasSnapshot.forEach(
            (documento) => {

                const conta =
                    documento.data();


                // CONTAS PAGAS

                if (
                    conta.status === "pago"
                ) {

                    contasPagas +=
                        Number(
                            conta.valor
                        );


                    historico.push({

                        tipo: "conta",

                        descricao:
                            conta.descricao,

                        valor:
                            Number(
                                conta.valor
                            ),

                        data:
                            conta.vencimento

                    });

                }


                // CONTAS PENDENTES

                if (
                    conta.status === "pendente"
                ) {

                    contasPendentes +=
                        Number(
                            conta.valor
                        );


                    listaContasPendentes.push({

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


        // =========================
        // SALDOS
        // =========================

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


        // =========================
        // PRÓXIMAS CONTAS
        // =========================

        listaContasPendentes.sort(
            (a, b) => {

                return String(
                    a.vencimento
                ).localeCompare(
                    String(
                        b.vencimento
                    )
                );

            }
        );


        listaProximasContas.innerHTML =
            "";


        if (
            listaContasPendentes.length === 0
        ) {

            listaProximasContas.innerHTML = `
                <p class="sem-contas">
                    Nenhuma conta pendente.
                </p>
            `;

        } else {

            listaContasPendentes
                .slice(0, 5)
                .forEach(
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


        // =========================
        // HISTÓRICO
        // =========================

        historico.sort(
            (a, b) => {

                return String(
                    b.data
                ).localeCompare(
                    String(
                        a.data
                    )
                );

            }
        );


        listaHistorico.innerHTML =
            "";


        const ultimos =
            historico.slice(0, 10);


        if (
            ultimos.length === 0
        ) {

            listaHistorico.innerHTML = `
                <p class="sem-historico">
                    Nenhuma movimentação registrada.
                </p>
            `;

        } else {

            ultimos.forEach(
                (movimento) => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        movimento.tipo === "entrada"
                            ? "card-historico entrada"
                            : "card-historico conta";


                    card.innerHTML = `
                        <div>

                            <h3>
                                ${movimento.descricao}
                            </h3>

                            <p>
                                ${formatarData(
                                    movimento.data
                                )}
                            </p>

                        </div>

                        <strong>
                            ${
                                movimento.tipo === "entrada"
                                    ? "+"
                                    : "-"
                            }
                            ${formatarMoeda(
                                movimento.valor
                            )}
                        </strong>
                    `;


                    listaHistorico
                        .appendChild(card);

                }
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar resumo:",
            erro
        );


        listaHistorico.innerHTML = `
            <p class="sem-historico">
                Não foi possível carregar o histórico.
            </p>
        `;

    }

}


carregarResumo();
