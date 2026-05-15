import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CitasMedicas from './components/CitasMedicas';
import Especialidades from './components/Especialidades';
import Pacientes from './components/Pacientes';
import Horarios from './components/Horarios';
import Doctores from './components/Doctores';
import UserProfile from './components/UserProfile';
import Usuarios from './components/Usuarios';
import Registro from './components/Registro';
import DashboardUser from './components/DashboardUser';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <UserProfile /> 


                // RUTAS DECLARADAS
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path='/citas' element={<CitasMedicas />} />
                    <Route path='/especialidades' element={<Especialidades />} />
                    <Route path='/pacientes' element={<Pacientes />} />
                    <Route path='/horarios' element={<Horarios />} />
                    <Route path='/doctores' element={<Doctores />} />
                    <Route path='/usuarios' element={<Usuarios />} />
                    <Route path='/registro' element={<Registro />} />
                    <Route path='/dashboard-user' element={<DashboardUser />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;
