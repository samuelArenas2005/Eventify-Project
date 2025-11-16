import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, Search, Home } from "lucide-react";

export default function Navigation({ user, logout }) {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const initials = user
    ? `${user.name.charAt(0)}${user.last_name.charAt(0)}`
    : "UU";

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

          <div
            className={"profileImageContainer"}
            onClick={() => navigate("/dashboard")}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className={"profileAvatar"} />
            ) : (
              <div className={"profileInitials"}>{initials}</div>
            )}
            <div className={"statusIndicator"}></div>
          </div>
        </div>

        {/* El menú desplegable se posiciona de forma absoluta, por eso está fuera del div */}
        {menuOpen && (
          <ul className="menuLinks">
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/searchPage">
                Eventos
              </Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/calendario">
                Calendario
              </Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/dashboard">
                Panel de Usuario
              </Link>
            </li>
            <li>
              <Link onClick={toggleMenuHamburguesa} to="/createEvent">
                Crear Evento
              </Link>
            </li>
            <li>
              <Link
                onClick={(e) => {
                  logout();
                  toggleMenuHamburguesa();
                }}
              >
                Cerrar Sesión
              </Link>
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
        <Link to="/login" className="NavBarLoginButton">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="NavBarRegisterButton">
          Regístrate
        </Link>
      </>
    );
  }

  const scrollToTop = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="nav-container">
        <nav className={`NavBar ${isScrolled ? "scrolled" : ""}`}>
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
      </div>


      {/* Botón flotante para volver al inicio */}
      {showHomeButton && (
        <button
          className="home-button"
          onClick={scrollToTop}
          aria-label="Volver al inicio"
        >
          <Home size={20} />
        </button>
      )}
    </>
  );
}
