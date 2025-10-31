// src/pages/Landing.jsx
import React from "react";
import style from "./Landing.module.css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/8197544/pexels-photo-8197544.jpeg';

function Landing() {
  return (
    <div className={style.landingContainer}>
      <section
        className={style.heroContainer}
        style={{ '--hero-bg-image': `url(${HERO_IMAGE_URL})` }}
      >
        {/* El div de contenido se centra sobre el fondo y el degradado */}
        <div className={style.heroContent}>
          <h1 className={style.logoText}>Eventify</h1>
          <p className={style.sloganText}>
            Tu plataforma definitiva para crear y descubrir eventos.
          </p>
          <div className={style.buttonContainer}>
            <Link to="/createEvent" className={`${style.button} ${style.buttonPrimary}`}>
              Crea Eventos
            </Link>
            <Link to="/searchPage" className={`${style.button} ${style.buttonSecondary}`}>
              Explora eventos{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>


      </section>

      {/* <section style={{ textAlign: "center", marginTop: "50px" }}>
        <div className={style.discover}>
          <h1 className={style.discoverTitle}>Descubre y Crea Eventos Increíbles</h1>
          <p>
            Únete a la comunidad universitaria más activa. Encuentra eventos que
            te inspiren y organiza experiencias memorables
          </p>
          <button className={style.exploreButton}>
            Explora eventos{" "}
            <i className="fa-solid fa-arrow-right" color="--fondo-menu"></i>
          </button>
          <button className={style.createButton}>Crea eventos</button>
        </div>

        <div className={style.estadisticas}>
          <div className={style.eventosMes}>
            <i className="fa-solid fa-calendar"></i>
            <h2>24</h2>
            Eventos este mes
          </div>
          <div className={style.personasTotal}>
            <i className="fa-solid fa-people-group"></i>
            <h2>1,847</h2>
            Estudiantes participando
          </div>
          <div className={style.calificacion}>
            <i className="fa-solid fa-star"></i>
            <h2>4.7</h2>
            Calificación promedio
          </div>
        </div>

        <h1>Hello world</h1>
        <p>Bienvenido a Eventify 🎉</p>
      </section> */}


    </div>

  );
}

export default Landing;
