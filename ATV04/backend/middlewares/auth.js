const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    try {
        let token = null;

        const authorization = req.headers.authorization;

        if (authorization && authorization.startsWith('Bearer ')) {
            token = authorization.split(' ')[1];
        }

        if (!token && req.body && req.body.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({
                mensagem: 'Token não informado'
            });
        }

        const dados = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = dados;

        next();

    } catch (error) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado'
        });
    }
};

const autorizar = (...perfis) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                mensagem: 'Usuário não autenticado'
            });
        }

        if (!perfis.includes(req.usuario.perfil)) {
            return res.status(403).json({
                mensagem: 'Acesso negado'
            });
        }

        next();
    };
};

module.exports = {
    autenticar,
    autorizar
};