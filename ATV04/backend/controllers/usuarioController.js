const bcrypt = require('bcryptjs');
const db = require('../config/database');

const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, perfil } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Nome, email e senha são obrigatórios'
            });
        }

        const perfilUsuario = perfil || 'comum';

        if (!['admin', 'comum'].includes(perfilUsuario)) {
            return res.status(400).json({
                mensagem: 'Perfil inválido'
            });
        }

        const [usuarios] = await db.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                mensagem: 'Email já cadastrado'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const [resultado] = await db.execute(
            `INSERT INTO usuarios (nome, email, senha, perfil)
             VALUES (?, ?, ?, ?)`,
            [nome, email, senhaHash, perfilUsuario]
        );

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso',
            usuario: {
                id: resultado.insertId,
                nome,
                email,
                perfil: perfilUsuario
            }
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};


const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.execute(
            `SELECT id, nome, email, perfil
             FROM usuarios`
        );

        return res.status(200).json(usuarios);

    } catch (error) {
        console.error('Erro ao listar usuários:', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};


const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        return res.status(200).json({
            mensagem: 'Usuário excluído com sucesso'
        });

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};


module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    excluirUsuario
};