import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { Moon, Sun, User, Bell } from 'lucide-react';
=======
import { Moon, Sun, Bell } from 'lucide-react'; // Quité 'User' que no se usaba
>>>>>>> 19d01910a103ad39ce0ea2302eb3488b9cdfe59e

export default function Navigation({ user, logout }) {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? `${user.name.charAt(0)}${user.last_name.charAt(0)}` : 'UU';
  
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 19d01910a103ad39ce0ea2302eb3488b9cdfe59e

          <div className={"profileImageContainer"}>
            {(user.avatar ? 
            <img src={user.avatar} alt="Avatar" className={"profileAvatar"} /> :
            <div className={"profileInitials"}>{initials}</div>)}
            <div className={"statusIndicator"}></div>
          </div>
        </div>

        {/* El menú desplegable se posiciona de forma absoluta, por eso está fuera del div */}
        {menuOpen && (
          <ul className="menuLinks">
<<<<<<< HEAD
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/">Inicio</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/eventos">Eventos</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/calendario">Calendario</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/createEvent">Crear Evento</Link>
            </li>
            <li>
              <Link onClick={(e) => {
                logout();
                toggleMenuHamburguesa();
              }}>Cerrar Sesión</Link>
=======
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/SearchPage">Eventos</Link></li>
            <li>
              <Link
                style={{
                  pointerEvents: "none",
                  color: "gray",
                  textDecoration: "none",
                  cursor: "not-allowed"
                }}
                to="/calendario"
              >
                Calendario
              </Link>
>>>>>>> 19d01910a103ad39ce0ea2302eb3488b9cdfe59e
            </li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/createEvent">Crear Evento</Link></li>
            <li><Link to="/" onClick={logout}>Cerrar Sesión</Link></li>
          </ul>
        )}
      </>
    );
  }

  // Componente para cuando el usuario NO está logueado
  function LoggedOutControls() {
    return <Link to="/login" className="NavBarLoginButton">Iniciar Sesión</Link>;
  }

  return (
    <nav className="NavBar">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="NavBarLogo">Eventify</div>
      </Link>

      {/* Contenedor principal de todos los elementos de la derecha */}
      <div className="nav-derecha">
        <div className="IconoTema" onClick={toggleTema}>
          {temaOscuro ? (
            <Moon className="icon" />
          ) : (
            <Sun className="icon" />
          )}
        </div>
        {user ? <LoggedInControls /> : <LoggedOutControls />}
      </div>
<<<<<<< HEAD


=======
>>>>>>> 19d01910a103ad39ce0ea2302eb3488b9cdfe59e
    </nav>
  );
}