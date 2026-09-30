import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const {
        entrar,
        carregando,
        erro
    } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const deuCerto = await entrar(email, senha);

        if (deuCerto) {
            navigate('/usuarios');
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <h1>Entrar</h1>

            <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            {erro && (
                <p style={{ color: 'red' }}>
                    {erro}
                </p>
            )}

            <button
                type="submit"
                disabled={carregando}
            >
                {carregando ? 'Entrando...' : 'Entrar'}
            </button>

        </form>
    );
}

export default Login;