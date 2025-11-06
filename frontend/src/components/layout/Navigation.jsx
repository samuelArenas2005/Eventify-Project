import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Bell } from 'lucide-react';

export default function Navigation({ user, logout }) {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? `${user.name.charAt(0)}${user.last_name.charAt(0)}` : 'UU';
  
  const navigate = useNavigate();

  const toggleTema = () => setTemaOscuro((v) => !v);
  const toggleMenuHamburguesa = () => setMenuOpen((v) => !v);

  useEffect(() => {
    if (temaOscuro) {
      document.body.classList.add("modo-oscuro");
    } else {
      document.body.classList.remove("modo-oscuro");
    }
  }, [temaOscuro]);

  // Componente para cuando el usuario está logueado
  function LoggedInControls() {
    return (
      <>
        {/* Este es el contenedor que agrupa los controles del usuario */}
        <div className="user-controls">
          <Bell className="icon" />
          
          <div className="menuHamburguesa" onClick={toggleMenuHamburguesa}>
            {menuOpen ? (
              <i className="fa-solid fa-square-xmark fa-spin"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </div>

          <div className={"profileImageContainer"} onClick={() => navigate('/dashboard')}>
            {(user.avatar ? 
            <img src={user.avatar} alt="Avatar" className={"profileAvatar"} /> :
            <div className={"profileInitials"}>{initials}</div>)}
            <div className={"statusIndicator"}></div>
          </div>
        </div>

        {/* El menú desplegable se posiciona de forma absoluta, por eso está fuera del div */}
        {menuOpen && (
          <ul className="menuLinks">
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/">Inicio</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/searchPage">Eventos</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/calendario">Calendario</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/dashboard">Panel de Usuario</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/createEvent">Crear Evento</Link>
            </li>
            <li>
              <Link onClick={(e) => {
                logout();
                toggleMenuHamburguesa();
              }}>Cerrar Sesión</Link>
            </li>
          </ul>
        )}
      </>
    );
  }

  // Componente para cuando el usuario NO está logueado
  function LoggedOutControls() {
    return (
      <>
        <Link to="/login" className="NavBarLoginButton">Iniciar Sesión</Link>
        <Link to="/register" className="NavBarRegisterButton">Regístrate</Link>
      </>
    );
  }

  return (
    <nav className="NavBar">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="NavBarLogo">Eventify</div>
      </Link>

      {/* Contenedor principal de todos los elementos de la derecha */}
      <div className="nav-derecha">
        {/* <div className="IconoTema" >
          {temaOscuro ? (
            <Moon className="iconDesactive" />
          ) : (
            <Sun className="iconDesactive" />
          )}
        </div> */}
        {user ? <LoggedInControls /> : <LoggedOutControls />}
      </div>

    </nav>
  );
}