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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EventCard from "../../components/UI/EventCard/EventCard.jsx";
import { getEvents } from "../SearchEvent/searchPage.js";

const HERO_IMAGE_URL = "/hero.jpg";
const HERO_WORDS = [
  "Inolvidables",
  "Épicos",
  "Memorables",
  "Vibrantes",
  "Impactantes",
];

function Landing() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(1); // Start at the middle one if we have 3
  const currentHeroWord = HERO_WORDS[highlightIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadFeaturedEvents() {
      const events = await getEvents(() => setSelectedEvent(null));
      // Ensure we have enough events for the carousel, or handle fewer
      setFeaturedEvents(events.slice(0, 5)); // Get up to 5 events for better rotation
      if (events.length > 0) {
        setCurrentEventIndex(Math.floor(Math.min(events.length, 5) / 2));
      }
    }
    loadFeaturedEvents();
  }, []);

  return (
    <div className={style.landingContainer}>
      {/* Hero Section con forma triangular */}
      <section className={style.heroContainer}>
        <div className={style.heroInner}>
          <div className={style.heroCopy}>
            <div className={style.heroBadge}>
              <span role="img" aria-label="cohete">
                🚀
              </span>
              La plataforma #1 para la vida en el campus
            </div>
            <h1 className={style.heroTitle}>
              Transforma la Vida Universitaria: Crea Eventos{" "}
              <span
                className={`${style.heroHighlight} ${style.heroHighlightAnimated}`}
              >
                {currentHeroWord}
              </span>{" "}
              en Minutos.
            </h1>
            <p className={style.heroDescription}>
              Desde reuniones de clubes y talleres académicos hasta grandes
              festivales. Centraliza registros, tickets y la promoción en una sola
              plataforma diseñada para tu campus.
            </p>
            <div className={style.heroActions}>
              <Link to="/createEvent" className={style.heroPrimaryButton}>
                <Plus size={18} />
                Crear mi primer evento
              </Link>
              <Link to="/searchPage" className={style.heroSecondaryButton}>
                Explorar Eventos
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={style.heroTrust}>
              <div className={style.trustAvatars}>
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80"
                  alt="Estudiante 1"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Estudiante 2"
                />
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                  alt="Estudiante 3"
                />
              </div>
              <p>
                Usado por <strong>+500 organizaciones estudiantiles</strong> en
                Latam
              </p>
            </div>
          </div>
          <div className={style.heroVisual}>
            <div className={style.visualBackdrop}></div>
            <img
              src={HERO_IMAGE_URL}
              alt="Estudiantes disfrutando un evento universitario"
              className={style.heroImage}
            />
            <div className={`${style.heroCard} ${style.heroCardNotification}`}>
              <span role="img" aria-label="confeti">
                🎉
              </span>
              <div>
                <p>Nuevo registro</p>
                <small>Club de Robótica acaba de publicar “TechNight 2024”</small>
              </div>
            </div>
            <div className={`${style.heroCard} ${style.heroCardStats}`}>
              <p>Dashboard del Evento</p>
              <div className={style.cardMetric}>
                <span>Asistentes: 450/500</span>
                <strong>90% Lleno</strong>
              </div>
            </div>
          </div>
        </div>
      </section>


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


        <div className={style.carouselContainer}>
          <button
            className={style.navButton}
            onClick={() => setCurrentEventIndex(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length)}
            aria-label="Evento anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={style.carouselTrack}>
            {featuredEvents.map((event, index) => {
              // Calculate position relative to current index
              let position = "hidden";
              const total = featuredEvents.length;

              // We want to show: prev, active, next
              // But with circular logic.
              // Simple approach for 3+ items:
              // active is current
              // prev is current - 1
              // next is current + 1

              const diff = (index - currentEventIndex + total) % total;

              if (diff === 0) position = "active";
              else if (diff === total - 1 || diff === -1) position = "prev";
              else if (diff === 1) position = "next";
              // For more than 3 items, others remain hidden or far back

              return (
                <div
                  key={event.id}
                  className={`${style.carouselCard} ${style[position]}`}
                  onClick={() => {
                    if (position === "prev") setCurrentEventIndex((currentEventIndex - 1 + total) % total);
                    if (position === "next") setCurrentEventIndex((currentEventIndex + 1) % total);
                  }}
                >
                  <EventCard {...event} />
                </div>
              );
            })}
          </div>

          <button
            className={style.navButton}
            onClick={() => setCurrentEventIndex(prev => (prev + 1) % featuredEvents.length)}
            aria-label="Siguiente evento"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className={style.showMoreContainer}>
          <Link to="/searchPage" className={style.showMoreButton}>
            Ver Todos los Eventos
            <ArrowRight size={18} />
          </Link>
        </div>
      </section >

      {/* CTA Crear Eventos */}
      < section className={style.createEventCTA} >
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
      </section >

      {/* Sección Sobre Nosotros */}
      < section className={style.aboutSection} >
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
      </section >

      {/* CTA Final */}
      < section className={style.finalCTA} >
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
      </section >
    </div >
  );
}

export default Landing;
