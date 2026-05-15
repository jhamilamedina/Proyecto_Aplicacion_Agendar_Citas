import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('usuario');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5001/api/usuarios/login', { email, password, role });
            const { role: serverRole, username: name, email: userEmail } = response.data;
    
            setError('');
            localStorage.setItem('userRole', serverRole);
            localStorage.setItem('userName', name || '');
            localStorage.setItem('userEmail', userEmail || '');
    
            if (serverRole === 'admin') {
                navigate('/dashboard');  // Redirige al dashboard de admin
            } else {
                navigate('/dashboard-user');  // Redirige al dashboard de usuario
            }
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error del servidor');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Rol:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Iniciar Sesión</button>
                </form>
                <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p> 
            </div>

            <div className="image-container">
                <img src="/imagen.png" alt="Login visual" />
            </div>
        </div>
    );
};

export default Login;
