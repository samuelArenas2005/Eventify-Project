import React from "react";
import { Shield, BarChart3 } from "lucide-react";
import styles from "./AdminAnalyticsHeader.module.css";

/**
 * Header para la barra lateral del panel de administrador
 */
const AdminAnalyticsHeader = () => {
  return (
    <div className={styles.adminHeaderSidebar}>
      <div className={styles.adminIconContainer}>
        <Shield size={48} className={styles.adminIcon} />
      </div>
      <div className={styles.adminDetailsSidebar}>
        <h2 className={styles.adminTitleSidebar}>Panel de Administrador</h2>
        <p className={styles.adminSubtitle}>
          <BarChart3 size={14} />
          Vista general del sistema
        </p>
      </div>
    </div>
  );
};

export default AdminAnalyticsHeader;
