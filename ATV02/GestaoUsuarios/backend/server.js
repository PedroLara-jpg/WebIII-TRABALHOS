
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let usuarios = [
    { id: 1, nome: 'Pedro Lara', email: 'pedro@email.com' },
    { id: 2, nome: 'Maria Silva', email: 'maria@email.com' }
];

let proximoId = 3;

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.get('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({
            erro: 'Usuário não encontrado.'
        });
    }

    res.json(usuario);
});

app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    if (!nome?.trim() || !email?.trim()) {
        return res.status(400).json({
            erro: 'Nome e e-mail são obrigatórios.'
        });
    }

    const usuario = {
        id: proximoId++,
        nome: nome.trim(),
        email: email.trim()
    };

    usuarios.push(usuario);

    res.status(201).json(usuario);
});

app.put('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({
            erro: 'Usuário não encontrado.'
        });
    }

    const { nome, email } = req.body;

    if (!nome?.trim() || !email?.trim()) {
        return res.status(400).json({
            erro: 'Nome e e-mail são obrigatórios.'
        });
    }

    usuario.nome = nome.trim();
    usuario.email = email.trim();

    res.json(usuario);
});

app.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = usuarios.findIndex(u => u.id === id);

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Usuário não encontrado.'
        });
    }

    usuarios.splice(indice, 1);

    res.json({
        mensagem: 'Usuário excluído com sucesso.'
    });
});

app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});