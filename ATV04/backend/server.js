require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./config/database');

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/login', authRoutes);
app.use('/api/admin', adminRoutes); 

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API funcionando!'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    try {
        const connection = await db.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        connection.release();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:');
        console.error(error.message);
    }
});