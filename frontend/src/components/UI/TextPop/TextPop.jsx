import React from 'react';
// Importamos el módulo CSS
import styles from './TextPop.module.css';
import svg1 from '../../../assets/svg/1.svg';
import svg2 from '../../../assets/svg/2.svg';
import svg3 from '../../../assets/svg/3.svg';

const AnimatedHeader = () => {
  
  // --- URLs de ejemplo ---
  // ¡Reemplaza estas URLs por las de tus SVGs!
  const svgUrl1 = svg1;
  const svgUrl2 = svg2;
  const svgUrl3 = svg3;
  // ---------------------

  return (
    <div className={styles.container}>
      {/* El 'textWrapper' es el contenedor principal que escuchará el evento hover
        y posicionará los SVGs de forma absoluta.
      */}
      <div className={styles.textWrapper}>
        
        {/* Título y Subtítulo */}
        <h1 className={styles.title}>EXPLORAR EVENTOS</h1>
        <h2 className={styles.subtitle}>Descubre eventos increíbles de tu universidad</h2>

        {/* Contenedor de SVGs animados */}
        <div className={styles.svgContainer}>
          <img 
            src={svgUrl1} 
            alt="Icon 1" 
            className={`${styles.svgIcon} ${styles.svg1}`} 
          />
          <img 
            src={svgUrl2} 
            alt="Icon 2" 
            className={`${styles.svgIcon} ${styles.svg2}`} 
          />
          <img 
            src={svgUrl3} 
            alt="Icon 3" 
            className={`${styles.svgIcon} ${styles.svg3}`} 
          />
        </div>

      </div>
    </div>
  );
};

export default AnimatedHeader;