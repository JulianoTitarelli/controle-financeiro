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

const mesSelecionado =
    document.getElementById("mesSelecionado");

const contasRef =
    collection(db, "contas");

const hoje = new Date();

mesSelecionado.value =
    `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}`;


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


        let encontrouContas = false;


        resultado.forEach(
            (documento) => {

                const conta =
                    documento.data();


                if (
                    !conta.vencimento.startsWith(
                        mesSelecionado.value
                    )
                ) {

                    return;

                }


                encontrouContas = true;


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
                        class="btn-repetir"
                    >
                        REPETIR
                    </button>


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


                const botaoRepetir =
                    card.querySelector(
                        ".btn-repetir"
                    );


                botaoRepetir.addEventListener(
                    "click",
                    () =>
                        repetirConta(
                            conta
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


        if (!encontrouContas) {

            listaContas.innerHTML = `
                <p>
                    Nenhuma conta cadastrada neste mês.
                </p>
            `;

        }


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
   REPETIR CONTA
======================================== */

async function repetirConta(conta) {

    const partes =
        conta.vencimento.split("-");

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);


    let novoAno = ano;

    let novoMes = mes + 1;


    if (novoMes > 12) {

        novoMes = 1;

        novoAno++;

    }


    const ultimoDia =
        new Date(
            novoAno,
            novoMes,
            0
        ).getDate();


    const novoDia =
        Math.min(
            dia,
            ultimoDia
        );


    const novaData =
        `${novoAno}-${String(novoMes).padStart(2, "0")}-${String(novoDia).padStart(2, "0")}`;


    try {

        await addDoc(
            contasRef,
            {

                descricao:
                    conta.descricao,

                valor:
                    Number(conta.valor),

                vencimento:
                    novaData,

                status:
                    "pendente",

                criadoEm:
                    new Date()

            }
        );


        alert(
            "Conta repetida com sucesso!"
        );


        carregarContas();


    } catch (erro) {

        console.error(erro);


        alert(
            "Não foi possível repetir a conta."
        );

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

mesSelecionado.addEventListener(
    "change",
    () => {

        carregarContas();

    }
);

/* ========================================
   INICIAR
======================================== */

carregarContas();
