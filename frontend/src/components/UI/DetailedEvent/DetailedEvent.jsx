import React, { useState } from 'react';
import styles from './DetailedEvent.module.css';

/**
 * Un componente de ventana flotante (modal) para mostrar los detalles de un evento.
 *
 * @param {object} props
 * @param {object} props.event - El objeto que contiene toda la información del evento.
 * @param {string} props.event.titulo
 * @param {string} props.event.descripcion
 * @param {string[]} props.event.imagenes - Array de URLs de imágenes.
 * @param {string|Date} props.event.fechaInicio
 * @param {string|Date} props.event.fechaFin
 * @param {string} props.event.direccion
 * @param {number} props.event.capacidad
 * @param {number} props.event.asistentes
 * @param {string} props.event.organizador
 * @param {string} props.event.categoria
 * @param {string} props.event.estado
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {boolean} [props.showEditar=false] - Mostrar el botón de editar.
 * @param {function} [props.onEditar] - Callback para el botón de editar.
 * @param {boolean} [props.showBorrar=false] - Mostrar el botón de borrar.
 * @param {function} [props.onBorrar] - Callback para el botón de borrar.
 * @param {boolean} [props.showRegistrar=false] - Mostrar el botón de registrar.
 * @param {function} [props.onRegistrar] - Callback para el botón de registrar.
 */
const EventModal = ({
  event,
  onClose,
  showEditar = false,
  onEditar,
  showBorrar = false,
  onBorrar,
  showRegistrar = false,
  onRegistrar,
}) => {
  const {
    titulo,
    descripcion,
    imagenes,
    fechaInicio,
    fechaFin,
    direccion,
    capacidad,
    asistentes,
    organizador,
    categoria,
    estado,
  } = event;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Formateador simple de fechas (puedes reemplazarlo por date-fns o moment)
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Prevenir que el clic en el contenido cierre el modal
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalBody}>
          {/* Columna de Galería */}
          <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
              {imagenes && imagenes.length > 0 ? (
                <img
                  src={imagenes[activeImageIndex]}
                  alt={`${titulo} - imagen principal`}
                  className={styles.mainImage}
                />
              ) : (
                <div className={styles.noImagePlaceholder}>Sin Imagen</div>
              )}
            </div>
            {imagenes && imagenes.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {imagenes.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className={`${styles.thumbnail} ${
                      index === activeImageIndex ? styles.active : ''
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Columna de Detalles */}
          <div className={styles.details}>
            <div className={styles.header}>
              <h2 className={styles.title}>{titulo}</h2>
              <div className={styles.tags}>
                <span className={`${styles.tag} ${styles.tagCategory}`}>
                  {categoria}
                </span>
                <span className={`${styles.tag} ${styles.tagStatus}`}>
                  {estado}
                </span>
              </div>
            </div>

            <p className={styles.description}>{descripcion}</p>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📅</span>
                <div>
                  <span className={styles.infoLabel}>Inicio:</span>
                  <span className={styles.infoValue}>{formatDate(fechaInicio)}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🏁</span>
                <div>
                  <span className={styles.infoLabel}>Fin:</span>
                  <span className={styles.infoValue}>{formatDate(fechaFin)}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📍</span>
                <div>
                  <span className={styles.infoLabel}>Ubicación:</span>
                  <span className={styles.infoValue}>{direccion}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>👤</span>
                <div>
                  <span className={styles.infoLabel}>Organizador:</span>
                  <span className={styles.infoValue}>{organizador}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>👥</span>
                <div>
                  <span className={styles.infoLabel}>Asistencia:</span>
                  <span className={styles.infoValue}>
                    {asistentes} / {capacidad}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Acciones */}
        {(showBorrar || showEditar || showRegistrar) && (
          <div className={styles.footerActions}>
            {showRegistrar && (
              <button
                className={`${styles.button} ${styles.registerButton}`}
                onClick={onRegistrar}
              >
                Registrarse
              </button>
            )}
            {showEditar && (
              <button
                className={`${styles.button} ${styles.editButton}`}
                onClick={onEditar}
              >
                Editar
              </button>
            )}
            {showBorrar && (
              <button
                className={`${styles.button} ${styles.deleteButton}`}
                onClick={onBorrar}
              >
                Borrar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;