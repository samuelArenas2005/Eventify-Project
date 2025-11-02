// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Github,
  ArrowUp
} from 'lucide-react';
import styles from './Footer.module.css';

/**
 * Footer minimalista e interactivo para Eventify
 * Incluye enlaces útiles, información de contacto y redes sociales
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        {/* Sección Principal */}
        <div className={styles.mainSection}>
          {/* Logo y Descripción */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <span>Eventify</span>
            </div>
            <p className={styles.description}>
              Conectamos personas a través de eventos increíbles. 
              Descubre, crea y participa en experiencias únicas.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Enlaces Rápidos</h4>
            <ul className={styles.linksList}>
              <li><Link to="/dashboard" className={styles.link}>Dashboard</Link></li>
              <li><Link to="/createEvent" className={styles.link}>Crear Evento</Link></li>
              <li><Link to="/searchEvent" className={styles.link}>Buscar Eventos</Link></li>
              <li><Link to="/analytics" className={styles.link}>Analytics</Link></li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className={styles.contactSection}>
            <h4 className={styles.sectionTitle}>Contacto</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>contacto@eventify.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+57 317 2715674</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>Cali, Valle del Cauca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea Divisoria */}
        <div className={styles.divider}></div>

        {/* Sección Inferior */}
        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <p>
              © {currentYear} Eventify. Hecho con <Heart size={14} className={styles.heart} /> para conectar el mundo.
            </p>
          </div>
          
          {/* Botón Volver Arriba */}
          <button 
            className={styles.scrollToTop}
            onClick={scrollToTop}
            aria-label="Volver arriba"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;