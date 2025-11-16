import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        {/*  */}
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>¡Oops! Página No Encontrada</h2>
        <p className={styles.description}>
          Parece que la página que buscas se perdió entre la multitud.
          Quizás el evento ya finalizó o la URL no es correcta.
        </p>
        <Link to="/" className={styles.homeButton}>
          Volver a Eventify
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;