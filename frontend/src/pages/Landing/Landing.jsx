// src/pages/Landing.jsx
import React from "react";
import "./Landing.css";

function Landing() {
  return (
    <section style={{ textAlign: "center", marginTop: "50px" }}>
      <div className="discover">
        <h1 className="discover-title">Descubre y Crea Eventos Increíbles</h1>
        <p>
          Únete a la comunidad universitaria más activa. Encuentra eventos que
          te inspiren y organiza experiencias memorables
        </p>
        <button className="explore-button">
          Explora eventos{" "}
          <i className="fa-solid fa-arrow-right" color="--fondo-menu"></i>
        </button>
        <button className="create-button">Crea eventos</button>
      </div>
      <div className="estadisticas">
        <div className="eventos-mes">
          <i className="fa-solid fa-calendar"></i>
          <h2>24</h2>
          Eventos este mes
        </div>
        <div className="personas-total">
          <i className="fa-solid fa-people-group"></i>
          <h2>1,847</h2>
          Estudiantes participando
        </div>
        <div className="calificacion">
          <i className="fa-solid fa-star"></i>
          <h2>4.7</h2>
          Calificación promedio
        </div>
      </div>

      <h1>Hello world</h1>
      <p>Bienvenido a Eventify 🎉</p>
    </section>
  );
}

export default Landing;
