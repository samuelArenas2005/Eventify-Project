import React, { useState } from "react";
import styles from "./DetailedEvent.module.css";
import {
  X,
  MapPin,
  Calendar,
  Users,
  User,
  Tag,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  CheckSquare,
  Info,
} from "lucide-react";

// Objeto para mapear el estado a un color (usando tus variables CSS)
const estadoColors = {
  Próximo: "var(--color-info)",
  "En Curso": "var(--color-success)",
  Finalizado: "var(--color-warning)",
  Cancelado: "var(--color-danger)",
};

const EventDetailModal = ({
  // Datos del evento
  titulo,
  descripcion,
  imag = [], // Array de URLs
  fechaInicio,
  fechaFin,
  direccion,
  capacidad,
  asistentes,
  organizador,
  categoria,
  estado,
  mainImage,

  // Nueva información opcional
  local_info, // detalle del local
  fechaCreacion, // string ISO o similar

  // Control del modal
  onClose,

  // Visibilidad de botones
  showBorrar = false,
  showEditar = false,
  showRegistrar = false,

  // Funciones de botones
  onBorrar,
  onEditar,
  onRegistrar,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const imagenes = imag.map((img) => img.image);
  // --- Lógica de la Galería ---
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  // --- Lógica de Fechas ---
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString("es-ES", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  // Formatea la fecha de creación mostrando solo YYYY-MM-DD (primeros caracteres)
  const formatCreationDate = (isoString) => {
    if (!isoString) return "No especificada";
    // Si viene en formato ISO, tomamos los primeros 10 caracteres: YYYY-MM-DD
    return typeof isoString === "string"
      ? isoString.slice(0, 10)
      : String(isoString);
  };

  // --- Lógica del Overlay ---
  const handleOverlayClick = (e) => {
    // Cierra solo si se hace clic en el fondo (overlay)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const estadoColor = estadoColors[estado] || "var(--text-secundary)";

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Botón de Cerrar */}
        <button className={styles.closeButton} onClick={onClose} title="Cerrar">
          <X size={24} />
        </button>

        {/* --- SECCIÓN IZQUIERDA: Galería --- */}
        <div className={styles.gallerySection}>
          {imagenes.length > 0 && (
            <div className={styles.gallery}>
              <div className={styles.mainImageContainer}>
                <img
                  src={imagenes[activeIndex]}
                  alt={`Imagen ${activeIndex + 1} de ${titulo}`}
                  className={styles.mainImage}
                />
                {imagenes.length > 1 && (
                  <>
                    <button
                      className={`${styles.galleryNav} ${styles.prev}`}
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      className={`${styles.galleryNav} ${styles.next}`}
                      onClick={handleNextImage}
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
              </div>
              {imagenes.length > 1 && (
                <div className={styles.thumbnailList}>
                  {imagenes.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Miniatura ${index + 1}`}
                      className={`${styles.thumbnail} ${
                        index === activeIndex ? styles.activeThumbnail : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- SECCIÓN DERECHA: Contenido --- */}
        <div className={styles.contentSection}>
          {/* --- Cuerpo del Modal (con scroll) --- */}
          <div className={styles.modalBody}>
            {/* --- Encabezado: Título y Tags --- */}
            <div className={styles.eventHeader}>
              <h2 className={styles.title}>{titulo}</h2>
              <div className={styles.tags}>
                <span
                  className={styles.tag}
                  style={{ backgroundColor: estadoColor, color: "white" }}
                >
                  <ClipboardList size={14} /> {estado}
                </span>
                <span
                  className={styles.tag}
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  <Tag size={14} /> {categoria}
                </span>
              </div>
            </div>

            {/* --- Grid de Información Principal --- */}
            <div className={styles.infoGrid}>
              <InfoItem
                icon={<Calendar size={20} />}
                label="Inicia"
                value={formatDate(fechaInicio)}
              />
              <InfoItem
                icon={<Calendar size={20} />}
                label="Finaliza"
                value={formatDate(fechaFin)}
              />
              <InfoItem
                icon={<MapPin size={20} />}
                label="Ubicación"
                value={direccion}
              />
              {/* Nuevo: muestra local_info si existe */}
              {local_info && (
                <InfoItem
                  icon={<Info size={20} />}
                  label="Información del Lugar"
                  value={local_info}
                />
              )}
              <InfoItem
                icon={<User size={20} />}
                label="Organizador"
                value={organizador}
              />
              <InfoItem
                icon={<Users size={20} />}
                label="Participantes"
                value={`${asistentes} / ${capacidad}`}
              />
              {/* Nuevo: fecha de creación del evento (YYYY-MM-DD) */}
              <InfoItem
                icon={<Calendar size={20} />}
                label="Creado"
                value={formatCreationDate(fechaCreacion)}
              />
            </div>

            {/* --- Descripción --- */}
            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Acerca del Evento</h3>
              <p className={styles.descriptionText}>{descripcion}</p>
            </div>
          </div>

          {/* --- Pie de Página (Acciones) --- */}
          {(showBorrar || showEditar || showRegistrar) && (
            <div className={styles.modalFooter}>
              {showRegistrar && (
                <button
                  className={`${styles.button} ${styles.registerButton}`}
                  onClick={onRegistrar}
                >
                  <CheckSquare size={18} /> Registrarse
                </button>
              )}
              {showEditar && (
                <button
                  className={`${styles.button} ${styles.editButton}`}
                  onClick={onEditar}
                >
                  <Edit size={18} /> Editar
                </button>
              )}
              {showBorrar && (
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={onBorrar}
                >
                  <Trash2 size={18} /> Borrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pequeño componente auxiliar para los items de información
const InfoItem = ({ icon, label, value }) => (
  <div className={styles.infoItem}>
    <span className={styles.infoIcon}>{icon}</span>
    <div className={styles.infoContent}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  </div>
);

export default EventDetailModal;
