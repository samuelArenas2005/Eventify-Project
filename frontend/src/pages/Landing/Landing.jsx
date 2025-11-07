// src/pages/Landing.jsx
import React, { useState, useEffect } from "react";
import style from "./Landing.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Calendar,
  Star,
  Search,
  Plus,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Zap,
  Heart,
  Award,
  Target,
  Globe,
} from "lucide-react";
import EventCard from "../../components/UI/EventCard/EventCard.jsx";
import { getEvents } from "../SearchEvent/searchPage.js";

const HERO_IMAGE_URL =
  "https://images.pexels.com/photos/8197544/pexels-photo-8197544.jpeg";

function Landing() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadFeaturedEvents() {
      const events = await getEvents(() => setSelectedEvent(null));
      // Tomar solo los primeros 3 eventos
      setFeaturedEvents(events.slice(0, 3));
    }
    loadFeaturedEvents();
  }, []);

  return (
    <div className={style.landingContainer}>
      {/* Hero Section con forma triangular */}
      <section
        className={style.heroContainer}
        style={{ "--hero-bg-image": `url(${HERO_IMAGE_URL})` }}
      >
        <div className={style.heroContent}>
          <h1 className={style.logoText}>Eventify</h1>
          <p className={style.sloganText}>
            Tu plataforma definitiva para crear y descubrir eventos
            universitarios
          </p>
          <div className={style.buttonContainer}>
            <Link
              to="/createEvent"
              className={`${style.button} ${style.buttonPrimary}`}
            >
              <Plus size={18} />
              Crea Eventos
            </Link>
            <Link
              to="/searchPage"
              className={`${style.button} ${style.buttonSecondary}`}
            >
              Explora eventos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {/* Forma triangular */}
        <div className={style.triangleShape}></div>
      </section>

      {/* Estadísticas */}
      {/* <section className={style.statsSection}>
        <div className={style.statsContainer}>
          <div className={style.statCard}>
            <div className={style.statIcon}>
              <Calendar size={32} />
            </div>
            <h3 className={style.statNumber}>500+</h3>
            <p className={style.statLabel}>Eventos Activos</p>
          </div>
          <div className={style.statCard}>
            <div className={style.statIcon}>
              <Users size={32} />
            </div>
            <h3 className={style.statNumber}>2,500+</h3>
            <p className={style.statLabel}>Estudiantes Participando</p>
          </div>
          <div className={style.statCard}>
            <div className={style.statIcon}>
              <Star size={32} />
            </div>
            <h3 className={style.statNumber}>4.8</h3>
            <p className={style.statLabel}>Calificación Promedio</p>
          </div>
        </div>
      </section> */}

      {/* Sección de Características */}
      <section className={style.featuresSection}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>¿Qué puedes hacer en Eventify?</h2>
          <p className={style.sectionSubtitle}>
            Descubre todas las posibilidades que te ofrecemos
          </p>
        </div>
        <div className={style.featuresGrid}>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <Search size={28} />
            </div>
            <h3 className={style.featureTitle}>Descubre Eventos</h3>
            <p className={style.featureDescription}>
              Explora una amplia variedad de eventos universitarios: académicos,
              culturales, deportivos y sociales
            </p>
          </div>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <Plus size={28} />
            </div>
            <h3 className={style.featureTitle}>Crea tu Evento</h3>
            <p className={style.featureDescription}>
              Organiza eventos en minutos con nuestras herramientas intuitivas
              de creación y gestión
            </p>
          </div>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <Users size={28} />
            </div>
            <h3 className={style.featureTitle}>Conecta con Personas</h3>
            <p className={style.featureDescription}>
              Conoce estudiantes con intereses similares y amplía tu red
              universitaria
            </p>
          </div>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <TrendingUp size={28} />
            </div>
            <h3 className={style.featureTitle}>Gestiona tu Dashboard</h3>
            <p className={style.featureDescription}>
              Administra tus eventos creados, inscripciones y pendientes desde
              un panel centralizado
            </p>
          </div>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <CheckCircle size={28} />
            </div>
            <h3 className={style.featureTitle}>Inscripciones Fáciles</h3>
            <p className={style.featureDescription}>
              Regístrate en eventos con un clic y recibe notificaciones sobre
              actualizaciones
            </p>
          </div>
          <div className={style.featureCard}>
            <div className={style.featureIcon}>
              <Award size={28} />
            </div>
            <h3 className={style.featureTitle}>Sistema de Calificaciones</h3>
            <p className={style.featureDescription}>
              Valora eventos y ayuda a otros estudiantes a encontrar las mejores
              experiencias
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Eventos Destacados */}
      <section className={style.eventsShowcase}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Eventos Destacados</h2>
          <p className={style.sectionSubtitle}>
            Descubre los eventos más populares de la comunidad
          </p>
        </div>
        <div className={style.eventsGrid}>
          {featuredEvents.map((event, index) => (
            <div key={event.id} className={style.eventCardWrapper}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
        <div className={style.showMoreContainer}>
          <Link to="/searchPage" className={style.showMoreButton}>
            Ver Todos los Eventos
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA Crear Eventos */}
      <section className={style.createEventCTA}>
        <div className={style.ctaContent}>
          <div className={style.ctaLeft}>
            <Sparkles className={style.ctaSparkle} size={48} />
            <h2 className={style.ctaTitle}>¿Tienes una idea increíble?</h2>
            <p className={style.ctaDescription}>
              Crear eventos nunca fue tan fácil. Con Eventify, puedes organizar
              eventos en minutos y llegar a cientos de estudiantes interesados.
            </p>
            <ul className={style.ctaFeaturesList}>
              <li>
                <CheckCircle size={20} />
                <span>Configuración rápida y sencilla</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Gestión de asistentes automática</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Notificaciones en tiempo real</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Análisis y estadísticas detalladas</span>
              </li>
            </ul>
            <button
              className={style.ctaPrimaryButton}
              onClick={() => navigate("/createEvent")}
            >
              <Zap size={20} />
              Crear mi Primer Evento
            </button>
          </div>
          <div className={style.ctaRight}>
            <div className={style.ctaImagePlaceholder}>
              <Calendar size={120} className={style.ctaPlaceholderIcon} />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section className={style.aboutSection}>
        <div className={style.aboutContent}>
          <div className={style.aboutLeft}>
            <div className={style.aboutImageContainer}>
              <Globe size={80} className={style.aboutIcon} />
            </div>
          </div>
          <div className={style.aboutRight}>
            <h2 className={style.aboutTitle}>Sobre Eventify</h2>
            <p className={style.aboutDescription}>
              Somos una plataforma creada por estudiantes, para estudiantes.
              Nuestro objetivo es transformar la manera en que la comunidad
              universitaria se conecta, aprende y crece juntos.
            </p>
            <p className={style.aboutDescription}>
              Desde conferencias académicas hasta eventos deportivos y
              culturales, Eventify es el puente que une a la comunidad
              universitaria con experiencias significativas.
            </p>
            <div className={style.aboutValues}>
              <div className={style.valueItem}>
                <Target size={24} />
                <div>
                  <h4>Nuestra Misión</h4>
                  <p>
                    Facilitar la conexión entre estudiantes a través de eventos
                    significativos
                  </p>
                </div>
              </div>
              <div className={style.valueItem}>
                <Heart size={24} />
                <div>
                  <h4>Nuestra Visión</h4>
                  <p>
                    Ser la plataforma líder de gestión de eventos universitarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={style.finalCTA}>
        <h2 className={style.finalCTATitle}>¿Listo para comenzar?</h2>
        <p className={style.finalCTASubtitle}>
          Únete a miles de estudiantes que ya están creando y descubriendo
          eventos increíbles
        </p>
        <div className={style.finalCTAButtons}>
          <Link to="/register" className={style.finalCTAPrimary}>
            Crear Cuenta Gratis
          </Link>
          <Link to="/searchPage" className={style.finalCTASecondary}>
            Explorar Eventos
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
