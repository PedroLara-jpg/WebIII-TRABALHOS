const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/database');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Email e senha são obrigatórios'
            });
        }

        const [usuarios] = await db.execute(
            `SELECT id, nome, email, senha, perfil
             FROM usuarios
             WHERE email = ?`,
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        const usuario = usuarios[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                perfil: usuario.perfil
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        return res.status(200).json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                perfil: usuario.perfil
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    login
};