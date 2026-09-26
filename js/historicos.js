import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const mesSelecionado =
    document.getElementById("mesSelecionado");

const totalEntradasMes =
    document.getElementById("totalEntradasMes");

const totalContasMes =
    document.getElementById("totalContasMes");

const saldoMes =
    document.getElementById("saldoMes");

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

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );
}


function mesAtual() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    return `${ano}-${mes}`;
}


async function carregarHistorico() {

    const mes =
        mesSelecionado.value;


    if (!mes) {

        return;

    }


    listaHistorico.innerHTML = `
        <p>
            Carregando...
        </p>
    `;


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


        let totalEntradas = 0;

        let totalContas = 0;


        const movimentacoes = [];


        // =========================
        // ENTRADAS
        // =========================

        entradasSnapshot.forEach(
            (documento) => {

                const entrada =
                    documento.data();


                if (
                    entrada.status === "recebido" &&
                    entrada.data &&
                    entrada.data.startsWith(mes)
                ) {

                    const valor =
                        Number(
                            entrada.valor
                        );


                    totalEntradas += valor;


                    movimentacoes.push({

                        tipo: "entrada",

                        descricao:
                            entrada.descricao,

                        valor: valor,

                        data:
                            entrada.data

                    });

                }

            }
        );


        // =========================
        // CONTAS PAGAS
        // =========================

        contasSnapshot.forEach(
            (documento) => {

                const conta =
                    documento.data();


                if (
                    conta.status === "pago" &&
                    conta.vencimento &&
                    conta.vencimento.startsWith(mes)
                ) {

                    const valor =
                        Number(
                            conta.valor
                        );


                    totalContas += valor;


                    movimentacoes.push({

                        tipo: "conta",

                        descricao:
                            conta.descricao,

                        valor: valor,

                        data:
                            conta.vencimento

                    });

                }

            }
        );


        // =========================
        // RESUMO
        // =========================

        const resultado =
            totalEntradas -
            totalContas;


        totalEntradasMes.textContent =
            formatarMoeda(
                totalEntradas
            );


        totalContasMes.textContent =
            formatarMoeda(
                totalContas
            );


        saldoMes.textContent =
            formatarMoeda(
                resultado
            );


        // =========================
        // ORDENAR
        // =========================

        movimentacoes.sort(
            (a, b) => {

                return String(
                    a.data
                ).localeCompare(
                    String(
                        b.data
                    )
                );

            }
        );


        // =========================
        // LISTA
        // =========================

        listaHistorico.innerHTML =
            "";


        if (
            movimentacoes.length === 0
        ) {

            listaHistorico.innerHTML = `
                <p class="sem-historico">
                    Nenhuma movimentação
                    encontrada neste mês.
                </p>
            `;

            return;

        }


        movimentacoes.forEach(
            (movimento) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card-conta";


                const sinal =
                    movimento.tipo === "entrada"
                        ? "+"
                        : "-";


                card.innerHTML = `

                    <h3>
                        ${movimento.descricao}
                    </h3>

                    <p>
                        ${formatarData(
                            movimento.data
                        )}
                    </p>

                    <strong>
                        ${sinal}
                        ${formatarMoeda(
                            movimento.valor
                        )}
                    </strong>

                `;


                listaHistorico
                    .appendChild(card);

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );


        listaHistorico.innerHTML = `
            <p class="sem-historico">
                Não foi possível carregar
                o histórico.
            </p>
        `;

    }

}


// =========================
// MÊS ATUAL
// =========================

mesSelecionado.value =
    mesAtual();


// =========================
// QUANDO TROCAR O MÊS
// =========================

mesSelecionado.addEventListener(
    "change",
    carregarHistorico
);


// =========================
// CARREGAR
// =========================

carregarHistorico();
