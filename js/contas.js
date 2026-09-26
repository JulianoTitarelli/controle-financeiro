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


const descricao =
    document.getElementById("descricao");

const valor =
    document.getElementById("valor");

const vencimento =
    document.getElementById("vencimento");

const salvarConta =
    document.getElementById("salvarConta");

const listaContas =
    document.getElementById("listaContas");


const contasRef =
    collection(db, "contas");



/* ========================================
   ADICIONAR CONTA
======================================== */

salvarConta.addEventListener(
    "click",
    async () => {

        const nome =
            descricao.value.trim();

        const valorConta =
            Number(valor.value);

        const dataVencimento =
            vencimento.value;


        if (!nome) {

            alert(
                "Digite a descrição da conta."
            );

            return;
        }


        if (
            !valorConta ||
            valorConta <= 0
        ) {

            alert(
                "Digite um valor válido."
            );

            return;
        }


        if (!dataVencimento) {

            alert(
                "Informe o vencimento."
            );

            return;
        }


        try {

            await addDoc(
                contasRef,
                {

                    descricao:
                        nome,

                    valor:
                        valorConta,

                    vencimento:
                        dataVencimento,

                    status:
                        "pendente",

                    criadoEm:
                        new Date()

                }
            );


            alert(
                "Conta adicionada com sucesso!"
            );


            descricao.value = "";

            valor.value = "";

            vencimento.value = "";


            carregarContas();


        } catch (erro) {

            console.error(erro);


            alert(
                "Não foi possível salvar a conta."
            );

        }

    }
);



/* ========================================
   CARREGAR CONTAS
======================================== */

async function carregarContas() {

    listaContas.innerHTML =
        "<p>Carregando...</p>";


    try {

        const consulta =
            query(
                contasRef,
                orderBy(
                    "vencimento",
                    "asc"
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        listaContas.innerHTML =
            "";


        if (resultado.empty) {

            listaContas.innerHTML = `
                <p>
                    Nenhuma conta cadastrada.
                </p>
            `;

            return;
        }


        resultado.forEach(
            (documento) => {

                const conta =
                    documento.data();


                const valorFormatado =
                    Number(
                        conta.valor
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style:
                                "currency",

                            currency:
                                "BRL"
                        }
                    );


                const dataFormatada =
                    new Date(
                        conta.vencimento +
                        "T00:00:00"
                    ).toLocaleDateString(
                        "pt-BR"
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card-conta";


                card.innerHTML = `

                    <h3>
                        ${conta.descricao}
                    </h3>

                    <p>
                        ${valorFormatado}
                    </p>

                    <p>
                        Vencimento:
                        ${dataFormatada}
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${
                                conta.status ===
                                "pago"
                                    ? "PAGO"
                                    : "PENDENTE"
                            }
                        </strong>
                    </p>


                    ${
                        conta.status ===
                        "pendente"

                        ? `
                            <button
                                class="btn-pagar"
                            >
                                MARCAR COMO PAGO
                            </button>
                        `

                        : `
                            <button
                                class="btn-desfazer"
                            >
                                VOLTAR PARA PENDENTE
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
                    () =>
                        alterarStatus(
                            documento.id,
                            conta.status
                        )
                );


                const botaoExcluir =
                    card.querySelector(
                        ".btn-excluir"
                    );


                botaoExcluir.addEventListener(
                    "click",
                    () =>
                        excluirConta(
                            documento.id,
                            conta.descricao
                        )
                );


                listaContas.appendChild(
                    card
                );

            }
        );


    } catch (erro) {

        console.error(erro);


        listaContas.innerHTML = `
            <p>
                Erro ao carregar as contas.
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
        statusAtual === "pendente"
            ? "pago"
            : "pendente";


    try {

        await updateDoc(
            doc(
                db,
                "contas",
                id
            ),
            {
                status:
                    novoStatus
            }
        );


        carregarContas();


    } catch (erro) {

        console.error(erro);


        alert(
            "Não foi possível alterar o status."
        );

    }

}



/* ========================================
   EXCLUIR CONTA
======================================== */

async function excluirConta(
    id,
    descricaoConta
) {

    const confirmar =
        confirm(
            `Deseja realmente excluir a conta "${descricaoConta}"?`
        );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "contas",
                id
            )
        );


        alert(
            "Conta excluída com sucesso!"
        );


        carregarContas();


    } catch (erro) {

        console.error(erro);


        alert(
            "Não foi possível excluir a conta."
        );

    }

}



/* ========================================
   INICIAR
======================================== */

carregarContas();

