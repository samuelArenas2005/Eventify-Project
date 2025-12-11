import React, { useState, useEffect } from "react";
import styles from "./DetailedEvent.module.css";
import {
  X, MapPin, Calendar, Users, User, Tag, ClipboardList,
  ChevronLeft, ChevronRight, Trash2, Edit, CheckSquare, Info, MessageSquare
} from "lucide-react";

import StarRating from "../StarRating/StarRating";
// Importamos la nueva función getEventRatings
import { createRating, getEventRatings } from "../../../api/api";

const estadoColors = {
  Próximo: "var(--color-info)",
  "En Curso": "var(--color-success)",
  Finalizado: "var(--color-warning)",
  FINISHED: "var(--color-warning)",
  Cancelado: "var(--color-danger)",
};

const EventDetailModal = ({
  id,
  titulo,
  descripcion,
  imag = [],
  fechaInicio,
  fechaFin,
  direccion,
  capacidad,
  asistentes,
  organizador,
  categoria,
  estado,
  local_info,
  fechaCreacion,
  myRating,
  onClose,
  showBorrar = false,
  showEditar = false,
  showRegistrar = false,
  onBorrar,
  onEditar,
  onRegistrar,
  onRatingUpdate,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imagenes = imag.map((img) => img.image);

  // --- ESTADOS PARA RATING ---
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [existingRating, setExistingRating] = useState(myRating);

  // --- ESTADOS PARA LA LISTA DE COMENTARIOS ---
  const [commentsList, setCommentsList] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Sincronizar estado local si cambia la prop myRating
  useEffect(() => {
    if (myRating) {
      setExistingRating(myRating);
      setRatingScore(myRating.score);
      setRatingComment(myRating.comment || "");
    }
  }, [myRating]);

  // Validamos si el evento está finalizado
  const isFinished = estado === 'Finalizado' || estado === 'FINISHED';

  // --- LÓGICA: Cargar Comentarios ---
  // Solo cargamos si el evento está finalizado y tenemos un ID
  useEffect(() => {
    const fetchComments = async () => {
      if (isFinished && id) {
        setLoadingComments(true);
        const data = await getEventRatings(id);
        // Opcional: Filtramos para no mostrar mi propio comentario en la lista general 
        // (ya que se muestra arriba en "Tu Reseña"), o lo dejamos. Aquí mostramos todos.
        setCommentsList(data);
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id, isFinished, existingRating]); // Recargar si yo envío una calificación nueva

  // --- Lógica Galería ---
  const handlePrevImage = () => setActiveIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  const handleNextImage = () => setActiveIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  const handleThumbnailClick = (index) => setActiveIndex(index);

  // --- Lógica Submit Rating ---
  const handleSubmitRating = async () => {
    if (ratingScore === 0) {
      setRatingError("Por favor selecciona una puntuación (estrellas).");
      return;
    }
    setIsSubmittingRating(true);
    setRatingError(null);

    try {
      const data = await createRating(id, ratingScore, ratingComment);
      setExistingRating(data);
      if (onRatingUpdate) onRatingUpdate();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Error al enviar calificación";
      setRatingError(msg);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" });
  };

  const formatCreationDate = (isoString) => isoString ? isoString.slice(0, 10) : "No especificada";
  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };
  const estadoColor = estadoColors[estado] || "var(--text-secundary)";

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} title="Cerrar"><X size={24} /></button>

        {/* SECCIÓN IZQUIERDA: Galería */}
        <div className={styles.gallerySection}>
          {imagenes.length > 0 ? (
            <div className={styles.gallery}>
              <div className={styles.mainImageContainer}>
                <img src={imagenes[activeIndex]} alt="Main" className={styles.mainImage} />
                {imagenes.length > 1 && (
                  <>
                    <button className={`${styles.galleryNav} ${styles.prev}`} onClick={handlePrevImage}><ChevronLeft size={28} /></button>
                    <button className={`${styles.galleryNav} ${styles.next}`} onClick={handleNextImage}><ChevronRight size={28} /></button>
                  </>
                )}
              </div>
              {imagenes.length > 1 && (
                <div className={styles.thumbnailList}>
                  {imagenes.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt="Thumb"
                      className={`${styles.thumbnail} ${index === activeIndex ? styles.activeThumbnail : ""}`}
                      onClick={() => handleThumbnailClick(index)} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Info size={48} opacity={0.5} />
            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA: Contenido */}
        <div className={styles.contentSection}>
          <div className={styles.modalBody}>
            <div className={styles.eventHeader}>
              <h2 className={styles.title}>{titulo}</h2>
              <div className={styles.tags}>
                <span className={styles.tag} style={{ backgroundColor: estadoColor, color: "white" }}>
                  <ClipboardList size={14} /> {estado}
                </span>
                <span className={styles.tag} style={{ backgroundColor: "var(--color-secondary)", color: "white" }}>
                  <Tag size={14} /> {categoria}
                </span>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <InfoItem icon={<Calendar size={20} />} label="Inicia" value={formatDate(fechaInicio)} />
              <InfoItem icon={<Calendar size={20} />} label="Finaliza" value={formatDate(fechaFin)} />
              <InfoItem icon={<MapPin size={20} />} label="Ubicación" value={direccion} />
              {local_info && <InfoItem icon={<Info size={20} />} label="Info Lugar" value={local_info} />}
              <InfoItem icon={<User size={20} />} label="Organizador" value={organizador} />
              <InfoItem icon={<Users size={20} />} label="Aforo" value={`${asistentes} / ${capacidad}`} />
              <InfoItem icon={<Calendar size={20} />} label="Creado" value={formatCreationDate(fechaCreacion)} />
            </div>

            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Acerca del Evento</h3>
              <p className={styles.descriptionText}>{descripcion}</p>
            </div>

            {/* --- SECCIÓN DE RATINGS Y COMENTARIOS --- */}
            {isFinished && (
              <div className={styles.ratingSection}>

                {/* 1. Mi Calificación (Formulario o Vista Previa) */}
                <h3 className={styles.sectionTitle}>
                  <MessageSquare size={20} style={{ marginRight: 8 }} />
                  {existingRating ? "Tu Reseña" : "Califica tu experiencia"}
                </h3>

                <div className={styles.ratingContainer}>
                  <div style={{ marginBottom: '1rem' }}>
                    <StarRating
                      score={ratingScore}
                      max={5}
                      size={32}
                      readOnly={!!existingRating}
                      onRate={(val) => setRatingScore(val)}
                    />
                  </div>

                  {existingRating ? (
                    <div className={styles.ratingCommentBox}>
                      <strong>Tu comentario:</strong>
                      <p style={{ marginTop: '5px', fontStyle: 'italic' }}>
                        {existingRating.comment ? `"${existingRating.comment}"` : "No dejaste ningún comentario escrito."}
                      </p>
                    </div>
                  ) : (
                    <div className={styles.ratingForm}>
                      <label htmlFor="ratingComment" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
                        ¿Qué fue lo que más te gustó? (Opcional)
                      </label>
                      <textarea
                        id="ratingComment"
                        className={styles.ratingTextarea}
                        placeholder="Escribe aquí tu opinión sobre el evento..."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows={3}
                      />
                      {ratingError && <p className={styles.errorMessage}>{ratingError}</p>}
                      <button
                        className={`${styles.button} ${styles.submitRatingButton}`}
                        onClick={handleSubmitRating}
                        disabled={isSubmittingRating}
                      >
                        {isSubmittingRating ? "Enviando..." : "Enviar Calificación"}
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Lista de Comentarios de Otros Usuarios (SCROLLBAR AQUÍ) */}
                {commentsList.length > 0 && (
                  <div className={styles.commentsContainer}>
                    <h4 className={styles.commentsTitle}>Opiniones de la comunidad ({commentsList.length})</h4>

                    <div className={styles.commentsScrollArea}>
                      {loadingComments ? (
                        <p>Cargando comentarios...</p>
                      ) : (
                        commentsList.map((comment) => (
                          <div key={comment.id} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                              <span className={styles.commentUser}>
                                <User size={16} /> {comment.username || "Usuario"}
                              </span>
                              <span className={styles.commentDate}>
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {/* Estrellas pequeñas para el comentario */}
                            <div style={{ pointerEvents: 'none', marginBottom: '0.5rem' }}>
                              <StarRating score={comment.score} max={5} size={16} readOnly={true} />
                            </div>
                            <p className={styles.commentText}>
                              {comment.comment || "Sin comentario escrito."}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de Acción (Footer) */}
          {(showBorrar || showEditar || showRegistrar) && (
            <div className={styles.modalFooter}>
              {showRegistrar && (
                <button className={`${styles.button} ${styles.registerButton}`} onClick={onRegistrar}>
                  <CheckSquare size={18} /> Registrarse
                </button>
              )}
              {showEditar && (
                <button className={`${styles.button} ${styles.editButton}`} onClick={onEditar}>
                  <Edit size={18} /> Editar
                </button>
              )}
              {showBorrar && (
                <button className={`${styles.button} ${styles.deleteButton}`} onClick={onBorrar}>
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