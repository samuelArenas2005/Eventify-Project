import React, { useCallback, useEffect, useState } from "react";
import { Flame, RefreshCw } from "lucide-react";
import EventCard from "../../UI/EventCard/EventCard";
import styles from "./PopularEventsView.module.css";
import { getPopularUpcomingEvents } from "../../../api/api";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200";

const formatDate = (value) => {
  if (!value) return "Fecha por definir";
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
};

const formatTime = (value) => {
  if (!value) return "Horario por definir";
  return new Date(value).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapEventToCard = (event) => ({
  id: event.id,
  imageUrl: event.main_image || event.images?.[0]?.image || PLACEHOLDER_IMAGE,
  category: event.category?.name || "Sin categoría",
  title: event.title || "Sin título",
  description: event.description || "Sin descripción",
  date: formatDate(event.start_date),
  time: formatTime(event.start_date),
  location: event.location_info || event.address || "Ubicación por definir",
  currentParticipants: event.attendees_count ?? 0,
  totalParticipants: event.capacity ?? 0,
  organizer:
    event.creator?.username || event.creator?.email || "Organizador anónimo",
  showRegisterButton: false,
  showHeartButton: false,
});

const PopularEventsView = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");

  const fetchPopularEvents = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setEmptyMessage("");
    try {
      const response = await getPopularUpcomingEvents();
      const payload = response?.data ?? {};
      const results = payload.results ?? [];
      setEvents(results.map(mapEventToCard));
      setEmptyMessage(!results.length ? payload.message || "" : "");
    } catch (fetchError) {
      console.error("Error fetching popular events:", fetchError);
      setError("No pudimos cargar los eventos populares. Intenta nuevamente.");
      setEvents([]);
      setEmptyMessage("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularEvents();
  }, [fetchPopularEvents]);

  const renderState = () => {
    if (isLoading) {
      return <div className={styles.stateCard}>Cargando eventos...</div>;
    }

    if (error) {
      return (
        <div className={`${styles.stateCard} ${styles.stateError}`}>
          <p>{error}</p>
          <button type="button" onClick={fetchPopularEvents}>
            Reintentar
          </button>
        </div>
      );
    }

    if (!events.length) {
      return (
        <div className={styles.stateCard}>
          {emptyMessage ||
            "No hay eventos próximos con inscritos suficientes para mostrar."}
        </div>
      );
    }

    return (
      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Panel de popularidad</p>
          <h2 className={styles.title}>
            <Flame size={22} /> Eventos populares
          </h2>
          <p className={styles.subtitle}>
            Los próximos eventos con mayor cantidad de usuarios inscritos.
          </p>
        </div>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={fetchPopularEvents}
          disabled={isLoading}
        >
          <RefreshCw size={18} />
          <span>{isLoading ? "Actualizando" : "Actualizar"}</span>
        </button>
      </header>
      {renderState()}
    </div>
  );
};

export default PopularEventsView;
