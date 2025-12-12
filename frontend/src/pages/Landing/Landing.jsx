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
import ConfirmarModal from "../../components/UI/ConfirmarModal/ConfirmarModal.jsx";
import { confirmEventRegistration } from "../../api/api.js";
import { toast } from "react-hot-toast";

const HERO_IMAGE_URL = "/hero.jpg";
const LOGO_IMAGE_URL = "/logoEventify.png";

const HERO_WORDS = [
  "Inolvidables",
  "Épicos",
  "Memorables",
  "Vibrantes",
  "Impactantes",
];

// Asegúrate de recibir user como prop
function Landing({ user }) {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [confirmState, setConfirmState] = useState({ open: false, event: null });
  const currentHeroWord = HERO_WORDS[highlightIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Función para registrar usuario en evento
  const onRegistrar = (event) => {
    // Usa el user recibido; como respaldo, revisa tokens en localStorage
    const hasSession =
      !!user ||
      !!localStorage.getItem("token") ||
      !!localStorage.getItem("access_token");

    if (!hasSession) {
      navigate("/login");
      return;
    }
    setConfirmState({ open: true, event });
  };

  const handleCancelConfirm = () => {
    setConfirmState({ open: false, event: null });
  };

  const handleConfirmRegistration = async () => {
    const eventId = confirmState.event?.id;
    if (!eventId) return;

    try {
      await confirmEventRegistration(eventId);
      toast.success("¡Tu registro al evento ha sido exitoso!");
      setConfirmState({ open: false, event: null });
      navigate("/dashboard");
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        error?.detail ||
        error?.message ||
        "No pudimos completar tu registro, inténtalo nuevamente.";

      if (typeof detail === 'string' && detail.toLowerCase().includes('ya estás inscrito')) {
        toast.error("Ya estás inscrito en este evento.");
      } else {
        toast.error(detail);
      }

      setConfirmState({ open: false, event: null });
    }
  };

  // Cargar eventos activos
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const events = await getEvents();
        const activeEvents = events.filter(event => {
          if (event.date && event.date !== "Por definir") {
            return true;
          }
          return true;
        });
        // Mapear eventos con funciones de registro
        const eventsWithHandlers = activeEvents.map((event) => ({
          ...event,
          handleImageTitleClick: () => {
            setSelectedEvent(event.formattedDetailEvent);
          },
          onRegisterClick: () => onRegistrar(event),
          showRegisterButton: true,
        }));
        setFeaturedEvents(eventsWithHandlers);
        setCurrentEventIndex(0);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setFeaturedEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Navegación del carrusel
  const handlePrevious = () => {
    setCurrentEventIndex((prev) => 
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentEventIndex((prev) => 
      prev === featuredEvents.length - 1 ? 0 : prev + 1
    );
  };

  // Obtener índices de los eventos a mostrar
  const getEventIndex = (offset) => {
    if (featuredEvents.length === 0) return null;
    // Si solo hay 1 evento, solo mostrar el centro
    if (featuredEvents.length === 1 && offset !== 0) return null;
    // Si hay 2 eventos, solo mostrar izquierda y centro, o centro y derecha
    if (featuredEvents.length === 2) {
      if (offset === -1 && currentEventIndex === 0) return null;
      if (offset === 1 && currentEventIndex === 1) return null;
    }
    const index = (currentEventIndex + offset + featuredEvents.length) % featuredEvents.length;
    return index;
  };

  const leftEventIndex = getEventIndex(-1);
  const centerEventIndex = featuredEvents.length > 0 ? currentEventIndex : null;
  const rightEventIndex = getEventIndex(1);

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
                Usado por <strong>+1 organizaciones estudiantiles</strong> en
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
        <div className={style.showcaseHeader}>
          <h2 className={style.showcaseTitle}>Eventos Destacados</h2>
          <p className={style.showcaseSubtitle}>
            Descubre los eventos más populares de tu campus
          </p>
        </div>
        
        {loadingEvents ? (
          <div className={style.loadingContainer}>
            <p>Cargando eventos...</p>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className={style.emptyContainer}>
            <p>No hay eventos disponibles en este momento</p>
          </div>
        ) : (
          <div className={style.carouselContainer}>
            <button 
              className={style.carouselButton} 
              onClick={handlePrevious}
              aria-label="Evento anterior"
            >
              <ChevronLeft size={32} />
            </button>
            
            <div className={style.carouselContent}>
              {/* Evento izquierda */}
              {leftEventIndex !== null && (
                <div className={`${style.carouselCard} ${style.carouselCardLeft}`}>
                  <EventCard
                    key={featuredEvents[leftEventIndex].id}
                    {...featuredEvents[leftEventIndex]}
                  />
                </div>
              )}
              
              {/* Evento centro (principal) */}
              {centerEventIndex !== null && (
                <div className={`${style.carouselCard} ${style.carouselCardCenter}`}>
                  <EventCard
                    key={featuredEvents[centerEventIndex].id}
                    {...featuredEvents[centerEventIndex]}
                  />
                </div>
              )}
              
              {/* Evento derecha */}
              {rightEventIndex !== null && (
                <div className={`${style.carouselCard} ${style.carouselCardRight}`}>
                  <EventCard
                    key={featuredEvents[rightEventIndex].id}
                    {...featuredEvents[rightEventIndex]}
                  />
                </div>
              )}
            </div>
            
            <button 
              className={style.carouselButton} 
              onClick={handleNext}
              aria-label="Siguiente evento"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
        
        {/* Indicadores de posición */}
        {featuredEvents.length > 0 && (
          <div className={style.carouselIndicators}>
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                className={`${style.indicator} ${
                  index === currentEventIndex ? style.indicatorActive : ""
                }`}
                onClick={() => setCurrentEventIndex(index)}
                aria-label={`Ir al evento ${index + 1}`}
              />
            ))}
          </div>
        )}
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
            <iframe src="https://lottie.host/embed/6abb92aa-9acc-4336-af9b-d5b4aa2a6df9/UYqzQ66MEd.lottie" className={style.ctaVideo}></iframe>
          </div>
        </div>
      </section >

      {/* Sección Sobre Nosotros */}
      < section className={style.aboutSection} >
        <div className={style.aboutContent}>
          <div className={style.aboutLeft}>
            <img src={LOGO_IMAGE_URL} alt="Eventify Logo" className={style.aboutImageContainer}  />
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
      {/* Modal de confirmación de registro */}
      <ConfirmarModal
        isOpen={confirmState.open}
        title="Confirmar registro"
        description="¿Deseas registrarte en este evento? Recibirás todas las actualizaciones en tu panel."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRegistration}
        onCancel={handleCancelConfirm}
      />
    </div >
  );
}

export default Landing;
