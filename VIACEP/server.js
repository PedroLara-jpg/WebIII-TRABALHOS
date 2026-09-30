const express = require('express');

const app = express();

const PORT = 3000;


const enderecos = [
    {
        nome: "Rua das Flores",
        cep: "83321000",
        bairro: "Centro",
        cidade: "Pontal do Paraná",
        estado: "PR"
    }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/cep/:numero', (req, res) => {

    const cep = req.params.numero;

    const endereco = enderecos.find(
        endereco => endereco.cep === cep
    );

    if (!endereco) {
        return res.status(404).json({
            erro: "CEP não encontrado"
        });
    }

    res.json(endereco);
});

app.get('/endereco/:nome', (req, res) => {

    const nome = req.params.nome;

    const endereco = enderecos.find(
        endereco => endereco.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!endereco) {
        return res.status(404).json({
            erro: "Endereço não encontrado"
        });
    }

    res.json(endereco);
});


app.get('/endereco/:nome/xml', (req, res) => {

    const nome = req.params.nome;

    const endereco = enderecos.find(
        endereco => endereco.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!endereco) {
        return res.status(404)
            .type('application/xml')
            .send(`
                <erro>
                    <mensagem>Endereço não encontrado</mensagem>
                </erro>
            `);
    }

    res.type('application/xml');

    res.send(`
        <endereco>
            <nome>${endereco.nome}</nome>
            <cep>${endereco.cep}</cep>
            <bairro>${endereco.bairro}</bairro>
            <cidade>${endereco.cidade}</cidade>
            <estado>${endereco.estado}</estado>
        </endereco>
    `);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});