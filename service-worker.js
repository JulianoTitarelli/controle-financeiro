const CACHE_NAME = "controle-financeiro-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./contas.html",
    "./entradas.html",
    "./historicos.html",
    "./css/style.css",
    "./js/firebase.js",
    "./js/app.js",
    "./js/contas.js",
    "./js/entradas.js",
    "./js/historicos.js",
    "./manifest.json",
    "./img/icon-512.png"
];


self.addEventListener(
    "install",
    (evento) => {

        evento.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    (cache) => {

                        return cache.addAll(
                            ARQUIVOS
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    (evento) => {

        evento.waitUntil(

            caches.keys()
                .then(
                    (nomes) => {

                        return Promise.all(

                            nomes
                                .filter(
                                    (nome) =>
                                        nome !==
                                        CACHE_NAME
                                )
                                .map(
                                    (nome) =>
                                        caches.delete(
                                            nome
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    (evento) => {

        evento.respondWith(

            caches.match(
                evento.request
            )
            .then(
                (resposta) => {

                    return (
                        resposta ||
                        fetch(
                            evento.request
                        )
                    );

                }
            )

        );

    }
);
