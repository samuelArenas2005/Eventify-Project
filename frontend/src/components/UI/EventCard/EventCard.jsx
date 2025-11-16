import React, { useState, useEffect } from "react";
import styles from "./EventCard.module.css";
import { Calendar, Clock, MapPin, Users, Heart, UserPlus, QrCode } from "lucide-react";
import { getCategories } from "../../../API/api";

const EventCard = ({
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
}) => {
  const [isHeartActive, setIsHeartActive] = useState(activeHeart);
  const [categoryColors, setCategoryColors] = useState({});

  // Cargar categorías y sus colores al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        // Crear un objeto con el mapeo de nombre -> color
        const colorMap = {};
        categories.forEach((cat) => {
          colorMap[cat.name] = cat.color;
        });
        setCategoryColors(colorMap);
        console.log("🎨 Colores de categorías cargados:", colorMap);
      } catch (error) {
        console.error("Error al cargar colores de categorías:", error);
      }
    };

    loadCategories();
  }, []);

  const handleHeartClick = () => {
    setIsHeartActive(!isHeartActive);
    onHeartClick && onHeartClick();
  };

  const getCategoryStyle = (categoryName) => {
    // Si tenemos el color de la categoría, lo usamos, sino un color por defecto
    const color = categoryColors[categoryName] || "#6B7280";
    // Convertir el color hex a rgba con transparencia
    return {
      backgroundColor: color + "99", // Añade transparencia (60%)
    };
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageWrapper} onClick={handleImageTitleClick}>
        <img src={imageUrl} alt={title} className={styles.eventImage} />
        <div className={styles.categoryTag} style={getCategoryStyle(category)}>
          <span className={styles.categoryText}>{category}</span>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleHeartContainer}>
          <h3 className={styles.eventTitle} onClick={handleImageTitleClick}>
            {title}
          </h3>
          {showHeartButton ? (
            <div className={`${styles.heartIcon}`} onClick={handleHeartClick}>
              {/* Icono de corazón más grande */}
              <Heart
                size={28}
                className={`${isHeartActive ? styles.heartActive : ""}`}
              />
            </div>
          ) : null}
          {generateQRCode ? (
            <div className={styles.qrCodeContainer} onClick={handleQRCodeClick}>
              <QrCode size={28} className={styles.qrCodeIcon} />
            </div>
          ) : null}
        </div>
        <p className={styles.eventDescription}>{description}</p>

        <div className={styles.detailItem}>
          {/* Iconos más grandes */}
          <Calendar size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>{date}</span>
        </div>
        <div className={styles.detailItem}>
          {/* Iconos más grandes */}
          <Clock size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>{time}</span>
        </div>
        <div className={styles.detailItem}>
          {/* Iconos más grandes */}
          <MapPin size={20} className={styles.detailIcon} />
          <span className={styles.detailText}>{location}</span>
        </div>
        <div className={styles.detailItem}>
          {/* Iconos más grandes */}
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
