import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [email, setEmail] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Leer el email del usuario desde localStorage
        const storedEmail = localStorage.getItem('userEmail');
        setEmail(storedEmail || '');
    }, []);

    const handleLogout = () => {
        // Eliminar el email del localStorage al cerrar sesión
        localStorage.removeItem('userEmail');
        setEmail('');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="user-profile">
            {email && (
                <div className="user-info" onClick={toggleDropdown}>
                    <span className="welcome-text">Bienvenido, {email}</span>
                    {showDropdown && (
                        <div className="dropdown">
                            <button onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
