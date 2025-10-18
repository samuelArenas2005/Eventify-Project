import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";

export default function Navigation() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cambiar tema claro/oscuro
  const toggleTema = () => {
    setTemaOscuro(!temaOscuro);
  };

  useEffect(() => {
    if (temaOscuro) {
      document.body.classList.add("modo-oscuro");
    } else {
      document.body.classList.remove("modo-oscuro");
    }
  }, [temaOscuro]);

  // Abrir/cerrar menú hamburguesa
  const toggleMenuHamburguesa = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="NavBar">
      {/* Logo */}
      <div className="NavBarLogo">Eventify</div>

      {/* Sección de íconos */}
      <div className="NavIcons">
        {/* Modo claro/oscuro */}
        <div className="IconoTema" onClick={toggleTema}>
          {temaOscuro ? (
            <i className="fa-regular fa-sun"></i>
          ) : (
            <i className="fa-regular fa-moon"></i>
          )}
        </div>

        {/* Notificaciones */}
        <div className="notificaciones">
          <i className="fa-regular fa-bell"></i>
          <span className="badge">3</span>
        </div>

        {/* Perfil */}
        <div className="perfil">
          <i className="fa-solid fa-circle-user"></i>
        </div>

        {/* Menú hamburguesa */}
        <div className="menuHamburguesa" onClick={toggleMenuHamburguesa}>
          {!menuOpen ? (
            <div>
            <i className="fa-solid fa-bars"></i>
            
            </div>
          ) : (
            <i className="fa-solid fa-square-xmark fa-spin"></i>
          )}
        </div>
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <ul className="menuLinks">
          <li>Inicio</li>
          <li>Eventos</li>
          <li>Calendario</li>
          <li>Dashboard</li>
          <li>Crear Evento</li>
        </ul>
      )}
    </nav>
  );
}
