import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registrate.css';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: '',
        role: 'usuario'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/usuarios', user);
            navigate('/usuarios'); // Redirigir a la lista de usuarios después de registrarse
        } catch (error) {
            setError('Error al registrar el usuario');
        }
    };

    return (
        <div className="register-container">
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Rol:</label>
                    <select
                        id="role"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
