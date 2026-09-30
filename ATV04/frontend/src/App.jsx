import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import RotaPrivada from './components/RotaPrivada';

import Login from './pages/Login/Login';
import Usuarios from './pages/Usuarios/Usuarios';
import PainelAdmin from './pages/PainelAdmin/PainelAdmin';
import SemPermissao from './pages/SemPermissao/SemPermissao';

function App() {

    return (
        <>
            <Header />

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/usuarios"
                    element={
                        <RotaPrivada>
                            <Usuarios />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <RotaPrivada perfilNecessario="admin">
                            <PainelAdmin />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="/sem-permissao"
                    element={<SemPermissao />}
                />

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/usuarios"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}

export default App;