import React, { useMemo } from "react";
import { Search } from "lucide-react";
import styles from "./AddAdminView.module.css";

const fakeUser = {
  id: "1107843980",
  name: "Samue Ampudia",
  email: "samue.ampudia@email.com",
};

const AddAdminView = ({ searchId, onSearchChange }) => {
  const matchedUser = useMemo(() => {
    if (!searchId) {
      return null;
    }
    return searchId.trim() === fakeUser.id ? fakeUser : null;
  }, [searchId]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Añadir administradores</h2>
        <p>Aquí puede volver admin a otro usuario.</p>
      </header>

      <div className={styles.searchCard}>
        <label htmlFor="admin-id-input">Identificador único del usuario</label>
        <div className={styles.searchInputWrapper}>
          <Search size={18} color="#6b7280" />
          <input
            id="admin-id-input"
            type="text"
            placeholder="Ej: 1107843980"
            className={styles.searchInput}
            value={searchId}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      {matchedUser ? (
        <div className={styles.resultCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{getInitials(matchedUser.name)}</div>
            <div>
              <p className={styles.userName}>{matchedUser.name}</p>
              <p className={styles.userEmail}>{matchedUser.email}</p>
              <p className={styles.userId}>ID: {matchedUser.id}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${styles.promoteButton}`}
            >
              Hacer admin
            </button>
            <button className={`${styles.actionButton} ${styles.removeButton}`}>
              Quitar admin
            </button>
          </div>
        </div>
      ) : searchId ? (
        <p className={styles.noResults}>
          No se encontró un usuario con ese identificador.
        </p>
      ) : (
        <p className={styles.helperText}>
          Ingresa el identificador para buscar un usuario.
        </p>
      )}
    </div>
  );
};

export default AddAdminView;
