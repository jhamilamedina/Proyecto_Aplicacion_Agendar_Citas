import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import './CircularButton.css'; // Asegúrate de tener este archivo CSS

const CircularButton = ({ imageSrc, altText, to, label }) => {
  return (
    <Link to={to} className="circular-button">
      <img src={imageSrc} alt={altText} className="button-image" />
      <div className="button-label">{label}</div>
    </Link>
  );
};

export default CircularButton;
