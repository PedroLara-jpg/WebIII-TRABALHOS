const express = require('express');

const {
    cadastrarUsuario,
    listarUsuarios,
    excluirUsuario
} = require('../controllers/usuarioController');

const {
    autenticar,
    autorizar
} = require('../middlewares/auth');

const router = express.Router();

router.post('/', cadastrarUsuario);

router.get('/', autenticar, listarUsuarios);

router.delete(
    '/:id',
    autenticar,
    autorizar('admin'),
    excluirUsuario
);

module.exports = router;