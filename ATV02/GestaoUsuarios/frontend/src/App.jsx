
import { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:3000/usuarios';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [modalAberta, setModalAberta] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [buscaId, setBuscaId] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function carregarUsuarios() {
        try {
            setCarregando(true);
            const resposta = await fetch(API);

            if (!resposta.ok) {
                throw new Error('Não foi possível carregar os usuários.');
            }

            const dados = await resposta.json();
            setUsuarios(dados);
            setErro('');
        } catch {
            setErro('Não foi possível conectar ao servidor.');
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    function abrirCadastro() {
        setUsuarioEditando(null);
        setNome('');
        setEmail('');
        setErro('');
        setModalAberta(true);
    }

    function abrirEdicao(usuario) {
        setUsuarioEditando(usuario);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setErro('');
        setModalAberta(true);
    }

    async function salvarUsuario(event) {
        event.preventDefault();
        setErro('');

        const editando = usuarioEditando !== null;

        try {
            const resposta = await fetch(
                editando ? `${API}/${usuarioEditando.id}` : API,
                {
                    method: editando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível salvar.');
            }

            setModalAberta(false);
            await carregarUsuarios();
        } catch (err) {
            setErro(err.message || 'Erro ao salvar usuário.');
        }
    }

    async function excluirUsuario(id) {
        const confirmar = window.confirm(
            'Deseja realmente excluir este usuário?'
        );

        if (!confirmar) return;

        try {
            const resposta = await fetch(`${API}/${id}`, {
                method: 'DELETE'
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao excluir.');
            }

            await carregarUsuarios();
        } catch (err) {
            setErro(err.message || 'Não foi possível excluir o usuário.');
        }
    }

    async function buscarPorId(event) {
        event.preventDefault();
        setErro('');

        if (!buscaId.trim()) {
            carregarUsuarios();
            return;
        }

        if (!Number.isInteger(Number(buscaId)) || Number(buscaId) <= 0) {
            setErro('Digite um ID válido.');
            return;
        }

        try {
            const resposta = await fetch(`${API}/${buscaId}`);
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Usuário não encontrado.');
            }

            setUsuarios([dados]);
        } catch (err) {
            setUsuarios([]);
            setErro(err.message || 'Erro ao buscar usuário.');
        }
    }

    return (
        <main className="pagina">
            <header className="cabecalho">
                <div>
                    <span className="etiqueta">PAINEL ADMINISTRATIVO</span>
                    <h1>Usuários</h1>
                    <p>Gerencie os usuários cadastrados no sistema.</p>
                </div>

                <button className="botao primario" onClick={abrirCadastro}>
                    + Novo usuário
                </button>
            </header>

            <section className="painel">
                <form className="busca" onSubmit={buscarPorId}>
                    <input
                        type="number"
                        min="1"
                        placeholder="Buscar usuário pelo ID"
                        value={buscaId}
                        onChange={e => setBuscaId(e.target.value)}
                    />

                    <button className="botao primario" type="submit">
                        Buscar
                    </button>

                    <button
                        className="botao secundario"
                        type="button"
                        onClick={() => {
                            setBuscaId('');
                            setErro('');
                            carregarUsuarios();
                        }}
                    >
                        Listar todos
                    </button>
                </form>

                {erro && !modalAberta && (
                    <div className="mensagem-erro">{erro}</div>
                )}

                {carregando ? (
                    <p className="estado">Carregando usuários...</p>
                ) : (
                    <div className="tabela-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>#{usuario.id}</td>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            <div className="acoes">
                                                <button
                                                    className="botao editar"
                                                    onClick={() =>
                                                        abrirEdicao(usuario)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="botao excluir"
                                                    onClick={() =>
                                                        excluirUsuario(usuario.id)
                                                    }
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {usuarios.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="estado">
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {modalAberta && (
                <div
                    className="fundo-modal"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            setModalAberta(false);
                        }
                    }}
                >
                    <section
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal"
                    >
                        <div className="modal-cabecalho">
                            <div>
                                <span className="etiqueta">
                                    GERENCIAMENTO
                                </span>

                                <h2 id="titulo-modal">
                                    {usuarioEditando
                                        ? 'Editar usuário'
                                        : 'Novo usuário'}
                                </h2>

                                <p>
                                    {usuarioEditando
                                        ? 'Atualize os dados do usuário.'
                                        : 'Preencha os dados para cadastrar.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="fechar-modal"
                                aria-label="Fechar modal"
                                onClick={() => setModalAberta(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={salvarUsuario}>
                            <label htmlFor="nome">Nome completo</label>
                            <input
                                id="nome"
                                type="text"
                                placeholder="Digite o nome"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                required
                                maxLength={100}
                                autoFocus
                            />

                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                maxLength={150}
                            />

                            {erro && (
                                <div className="mensagem-erro">{erro}</div>
                            )}

                            <div className="modal-acoes">
                                <button
                                    type="button"
                                    className="botao secundario"
                                    onClick={() => setModalAberta(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="botao primario"
                                >
                                    {usuarioEditando
                                        ? 'Salvar alterações'
                                        : 'Cadastrar usuário'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default App;