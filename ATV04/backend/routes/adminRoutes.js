const express = require('express');

const {
    painelAdmin
} = require('../controllers/adminController');

const {
    autenticar,
    autorizar
} = require('../middlewares/auth');

const router = express.Router();

router.get(
    '/',
    autenticar,
    autorizar('admin'),
    painelAdmin
);

module.exports = router;