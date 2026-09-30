const painelAdmin = (req, res) => {
    return res.status(200).json({
        mensagem: 'Bem-vindo ao painel administrativo',
        usuario: req.usuario
    });
};

module.exports = {
    painelAdmin
};