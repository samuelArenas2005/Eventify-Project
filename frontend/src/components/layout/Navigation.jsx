import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";

export default function Navigation({ user, logout}) {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTema = () => setTemaOscuro((v) => !v);
  const toggleMenuHamburguesa = () => setMenuOpen((v) => !v);

  useEffect(() => {
    if (temaOscuro) document.body.classList.add("modo-oscuro");
    else document.body.classList.remove("modo-oscuro");
  }, [temaOscuro]);

  function LoggedInControls() {
    return (
      <>
        <div className="NavIcons">
          <div className="IconoTema" onClick={toggleTema}>
            {temaOscuro ? (
              <i className="fa-regular fa-sun"></i>
            ) : (
              <i className="fa-regular fa-moon"></i>
            )}
          </div>

          <div className="notificaciones">
            <i className="fa-regular fa-bell"></i>
            <span className="badge">3</span>
          </div>

          <div className="perfil">
            <i className="fa-solid fa-circle-user"></i>
          </div>

          <div className="menuHamburguesa" onClick={toggleMenuHamburguesa}>
            {!menuOpen ? (
              <i className="fa-solid fa-bars"></i>
            ) : (
              <i className="fa-solid fa-square-xmark fa-spin"></i>
            )}
          </div>
        </div>

        {menuOpen && (
          <ul className="menuLinks">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/events">Eventos</Link>
            </li>
            <li>
              <Link to="/calendar">Calendario</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/createEvent">Crear Evento</Link>
            </li>
            <li>
              <Link to="/createEvent">Crear Evento</Link>
            </li>
            <li>
              <button onClick={logout}>logout</button>
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

      {user ? <LoggedInControls /> : <LoggedOutControls />}
    </nav>
  );
}
