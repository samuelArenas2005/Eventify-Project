import React, { useState } from 'react';
import styles from './EventCard.module.css';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';

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
  activeHeart,
}) => {
  const [isHeartActive, setIsHeartActive] = useState(activeHeart);

  const handleHeartClick = () => {
    setIsHeartActive(!isHeartActive);
    onHeartClick && onHeartClick();
  };

  const handleImageTitleClick = () => {
    console.log('Abrir detalle del evento (componente futuro)');
  };

  const categoryColors = {
    'Tecnología': 'rgba(61, 23, 80, 0.56)',
    'IA': 'rgba(23, 61, 80, 0.56)',
    'DEPORTIVO': 'rgba(23, 80, 61, 0.56)',
  };

  const getCategoryStyle = (categoryName) => ({
    backgroundColor: categoryColors[categoryName] || 'rgba(0, 0, 0, 0.56)',
  });

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
          <h3 className={styles.eventTitle} onClick={handleImageTitleClick}>{title}</h3>
          {showHeartButton ? <div
            className={`${styles.heartIcon}`}
            onClick={handleHeartClick}
          >
            {/* Icono de corazón más grande */}
            <Heart size={28} className={`${isHeartActive ? styles.heartActive : ''}`}/> 
          </div> 
          :null }
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
          <span className={styles.detailText}>{currentParticipants}/{totalParticipants} Participantes</span>
        </div>

        <div className={styles.organizerSection}>
          <span className={styles.organizerText}>Organizado por </span>
          <span className={styles.organizerName}>{organizer}</span>
        </div>

        {showRegisterButton ? 
        <button className={styles.registerButton} onClick={onRegisterClick}>
          Registrarse
        </button> 
        : null}
      </div>
    </div>
  );
};

export default EventCard;