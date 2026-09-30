import { useEffect, useState } from 'react';

import api from '../../services/api';

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {

        const carregarUsuarios = async () => {

            try {

                const response = await api.get('/usuarios');

                setUsuarios(response.data);

            } catch (error) {

                if (error.response?.status === 401) {
                    setErro('Você não está autenticado.');
                } else if (error.response?.status === 403) {
                    setErro('Você não possui permissão.');
                } else {
                    setErro('Erro ao carregar usuários.');
                }

            } finally {
                setCarregando(false);
            }
        };

        carregarUsuarios();

    }, []);

    if (carregando) {
        return <p>Carregando usuários...</p>;
    }

    return (
        <div>

            <h1>Usuários</h1>

            {erro && (
                <p style={{ color: 'red' }}>
                    {erro}
                </p>
            )}

            {!erro && usuarios.length === 0 && (
                <p>Nenhum usuário encontrado.</p>
            )}

            {!erro && usuarios.length > 0 && (
                <ul>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            {usuario.nome} -
                            {' '}
                            {usuario.email} -
                            {' '}
                            {usuario.perfil}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default Usuarios;