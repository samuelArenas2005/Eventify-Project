import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { Moon, Sun, User, Bell  } from 'lucide-react';

export default function Navigation({ user, logout }) {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTema = () => setTemaOscuro((v) => !v);
  const toggleMenuHamburguesa = () => setMenuOpen((v) => !v);

  useEffect(() => {
    if (temaOscuro) document.body.classList.add("modo-oscuro");
    else document.body.classList.remove("modo-oscuro");
  }, [temaOscuro]);

  console.log(user)

  function LoggedInControls() {
    return (
      <>
        {/* Sección de íconos */}
          {/* Menú hamburguesa */}
          <Bell className="iconoNotificaciones" />
          <div className="menuHamburguesa" onClick={toggleMenuHamburguesa}>
            {!menuOpen ? (
              <div>
                <i className="fa-solid fa-bars"></i>
              </div>
            ) : (
              <i className="fa-solid fa-square-xmark fa-spin"></i>
            )}
          </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <ul className="menuLinks">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link style={{
                pointerEvents: "none",
                color: "gray",
                textDecoration: "none",
                cursor: "not-allowed"
              }}
                to="/eventos">Eventos</Link>
            </li>
            <li>
              <Link
                style={{
                  pointerEvents: "none",
                  color: "gray",
                  textDecoration: "none",
                  cursor: "not-allowed"
                }} to="/calendario">Calendario</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/createEvent">Crear Evento</Link>
            </li>
            <li>
              <Link onClick={logout}>Cerrar Sesión</Link>
            </li>
          </ul>
        )}
      </>
    );
  }

  function LoggedOutControls() {
    return <Link to="/login" className="NavBarLoginButton">Iniciar Sesión</Link>;
  }

  return (
    <nav className="NavBar">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="NavBarLogo">Eventify</div>
      </Link>

      <div className="NavIcons">
        <div className="IconoTema" onClick={toggleTema}>
          {temaOscuro ? (
            <Moon className="icon"></Moon>
          ) : (
            <Sun className="icon"></Sun>
          )}
        </div>
        {user ? <LoggedInControls /> : <LoggedOutControls />}
      </div>

      
    </nav>
  );

}