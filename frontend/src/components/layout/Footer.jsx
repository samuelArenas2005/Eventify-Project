// src/components/Footer/Footer.jsx

import React from 'react';
import styles from './Footer.module.css';

/**
 * Componente de pie de página (Footer) simple.
 * Muestra el copyright y el año actual.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        © {currentYear} Mi Aplicación. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;