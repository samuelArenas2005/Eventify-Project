import React from "react";
import styles from "./AnalyticsLayout.module.css";

/**
 * Componente reutilizable para layouts de estadísticas
 * @param {Object} props
 * @param {React.ReactNode} props.sidebarHeader - Contenido del header de la barra lateral (imagen del evento o título de admin)
 * @param {Array} props.menuItems - Array de objetos con {id, icon, label} para el menú
 * @param {string} props.activeView - ID de la vista activa
 * @param {Function} props.onViewChange - Callback cuando cambia la vista
 * @param {React.ReactNode} props.children - Contenido principal
 */
const AnalyticsLayout = ({
  sidebarHeader,
  menuItems,
  activeView,
  onViewChange,
  children,
}) => {
  return (
    <div className={styles.analyticsContainer}>
      {/* Barra lateral */}
      <aside className={styles.sidebar}>
        {/* Header personalizable */}
        {sidebarHeader}

        <div className={styles.sidebarDivider}></div>

        <ul className={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${styles.menuItem} ${
                activeView === item.id ? styles.active : ""
              }`}
              onClick={() => onViewChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        <div className={styles.contentArea}>{children}</div>
      </main>
    </div>
  );
};

export default AnalyticsLayout;
