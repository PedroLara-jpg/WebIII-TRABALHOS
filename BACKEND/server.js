const express = require('express');

const app = express();

const PORT = 3000;

app.get('/cep/:numero', (req, res) => {

    const cep = req.params.numero;

    const endereco = {
        cep: cep,
        logradouro: "Rua das Flores",
        bairro: "Centro",
        cidade: "Pontal do Paraná",
        estado: "PR"
    };

    res.json(endereco);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});