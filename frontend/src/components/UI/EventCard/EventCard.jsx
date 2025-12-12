import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EventCard.module.css";
import {
  Calendar, Clock, MapPin, Users, Heart, QrCode, Scan
} from "lucide-react";
import { getCategories, setEventFavorite, unsetEventFavorite } from "../../../api/api";
import { toast } from "react-hot-toast";
import StarRating from "../StarRating/StarRating";

const EventCard = ({
  id,
  imageUrl,
  category,
  title,
  description,
  date,
  time,
  location,
  currentParticipants,
  totalParticipants,
  organizer,
  onRegisterClick,
  onHeartClick,
  showHeartButton,
  showRegisterButton,
  activeHeart = true,
  handleImageTitleClick,
  generateQRCode = false,
  handleQRCodeClick,
  readQRCode = false,
  handleReadQrCodeClick,
  // NUEVAS PROPS
  status,
  myRating, // Objeto { score, comment } o null
}) => {
  const navigate = useNavigate();
  const [isHeartActive, setIsHeartActive] = useState(activeHeart);
  const [categoryColors, setCategoryColors] = useState({});

  const handleTitleClick = () => {
    if (handleImageTitleClick) {
      handleImageTitleClick();
    } else if (id) {
      navigate(`/event/${id}/analytics`);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        const colorMap = {};
        categories.forEach((cat) => {
          colorMap[cat.name] = cat.color;
        });
        setCategoryColors(colorMap);
      } catch (error) {
        console.error("Error al cargar colores:", error);
      }
    };
    loadCategories();
  }, []);

  const handleHeartClick = async () => {
    const next = !isHeartActive;
    setIsHeartActive(next);

    try {
      if (!id) return;
      if (next) {
        await setEventFavorite(id);
        toast.success("Añadido a favoritos");
        window.location.reload();

      } else {
        await unsetEventFavorite(id);
        toast.success("Eliminado de favoritos");
        window.location.reload();

      }
    } catch (error) {
      // Revertir si falla
      setIsHeartActive((prev) => !prev);
      const detail =
        error?.response?.data?.detail ||
        error?.message ||
        "Acción de favorito fallida";
      toast.error(detail);
    }

    onHeartClick && onHeartClick();
  };

  const getCategoryStyle = (categoryName) => {
    const color = categoryColors[categoryName] || "#6B7280";
    return { backgroundColor: color + "99" };
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageWrapper} onClick={handleTitleClick}>
        <img src={imageUrl} alt={title} className={styles.eventImage} />
        <div className={styles.categoryTag} style={getCategoryStyle(category)}>
          <span className={styles.categoryText}>{category}</span>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleHeartContainer}>
          <h3 className={styles.eventTitle} onClick={handleTitleClick}>
            {title}
          </h3>

          {/* BOTONES DE ACCIÓN (Corazón, QR) */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {showHeartButton && (
              <div className={`${styles.heartIcon}`} onClick={handleHeartClick}>
                <Heart size={28} className={`${isHeartActive ? styles.heartActive : ""}`} />
              </div>
            )}
            {generateQRCode && (
              <div className={styles.qrCodeContainer} onClick={handleQRCodeClick}>
                <QrCode size={28} className={styles.qrCodeIcon} />
              </div>
            )}
            {readQRCode && (
              <div className={styles.qrCodeContainer} onClick={handleReadQrCodeClick}>
                <Scan size={28} className={styles.qrCodeIcon} />
              </div>
            )}
          </div>
        </div>

        {/* --- NUEVO: MOSTRAR RATING SI EL EVENTO FINALIZÓ --- */}
        {status === 'FINISHED' && myRating && (
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Tu calificación:</span>
            <StarRating score={myRating.score} size={18} readOnly={true} />
          </div>
        )}

        <p className={styles.eventDescription}>{description}</p>

        <div className={styles.detailItem}>
          <Calendar size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>{date}</span>
        </div>
        <div className={styles.detailItem}>
          <Clock size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>{time}</span>
        </div>
        <div className={styles.detailItem}>
          <MapPin size={20} className={styles.detailIcon} />
          <span className={`${styles.detailText} ${styles.locationText}`}>{location}</span>
        </div>
        <div className={styles.detailItem}>
          <Users size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>
            {currentParticipants}/{totalParticipants} Participantes
          </span>
        </div>

        <div className={styles.organizerSection}>
          <span className={styles.organizerText}>Organizado por </span>
          <span className={styles.organizerName}>{organizer}</span>
        </div>

        <div className={styles.actions}>
          {showRegisterButton && (
            <button className={styles.registerButton} onClick={onRegisterClick}>
              Registrarme
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;