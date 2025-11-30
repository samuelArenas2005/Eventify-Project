import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import styles from "./AddAdminView.module.css";
import {
  getUserByCedula,
  promoteAdminByCedula,
  removeAdminByCedula,
} from "../../../api/api";

const AddAdminView = ({ searchId, onSearchChange }) => {
  const [userResult, setUserResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  useEffect(() => {
    if (!searchId?.trim()) {
      setUserResult(null);
      setStatusMessage("");
    }
  }, [searchId]);

  const handleSearch = useCallback(async () => {
    const trimmed = searchId?.trim();
    if (!trimmed) {
      setStatusMessage("Ingresa una cédula para realizar la búsqueda.");
      setUserResult(null);
      return;
    }

    try {
      setIsSearching(true);
      setStatusMessage("");

      const response = await getUserByCedula(trimmed);
      const data = response?.data ?? null;

      if (!data) {
        setStatusMessage("No se encontró un usuario con esa cédula.");
        setUserResult(null);
        return;
      }

      setUserResult(data);
    } catch (error) {
      console.error("Error searching user by cédula:", error);
      const notFound = error?.response?.status === 404;
      setStatusMessage(
        notFound
          ? "No se encontró un usuario con esa cédula."
          : "Ocurrió un error al buscar. Intenta nuevamente."
      );
      setUserResult(null);
    } finally {
      setIsSearching(false);
    }
  }, [searchId]);

  const refreshUserData = useCallback(async () => {
    const trimmed = searchId?.trim();
    if (!trimmed) return;
    try {
      const response = await getUserByCedula(trimmed);
      setUserResult(response?.data ?? null);
    } catch (error) {
      console.error("Error refreshing user info:", error);
      setUserResult(null);
      setStatusMessage("No se pudo refrescar la información del usuario.");
    }
  }, [searchId]);

  const handleAdminToggle = async (shouldPromote) => {
    if (!userResult?.cedula || isUpdatingAdmin) return;

    try {
      setIsUpdatingAdmin(true);
      setStatusMessage("");

      if (shouldPromote) {
        await promoteAdminByCedula(userResult.cedula);
      } else {
        await removeAdminByCedula(userResult.cedula);
      }

      await refreshUserData();
      setStatusMessage(
        shouldPromote
          ? "Usuario promovido a administrador."
          : "Permisos de administrador removidos."
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
      setStatusMessage(
        "No se pudo actualizar el estado de administrador. Intenta nuevamente."
      );
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const trimmedSearch = searchId?.trim();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Añadir administradores</h2>
        <p>Aquí puede volver admin a otro usuario.</p>
      </header>

      <div className={styles.searchCard}>
        <label htmlFor="admin-id-input">Identificador único del usuario</label>
        <div className={styles.searchInputWrapper}>
          <input
            id="admin-id-input"
            type="text"
            placeholder="Ej: 1107843980"
            className={styles.searchInput}
            value={searchId}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={isSearching}
            aria-label="Buscar usuario por cédula"
          >
            <Search size={18} color="#ffffff" />
          </button>
        </div>
      </div>

      {userResult ? (
        <div className={styles.resultCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{getInitials(userResult.name)}</div>
            <div>
              <p className={styles.userName}>{userResult.name}</p>
              <p className={styles.userEmail}>{userResult.email}</p>
              <p className={styles.userId}>Cédula: {userResult.cedula}</p>
            </div>
          </div>
          <div className={styles.actions}>
            {!userResult.is_admin ? (
              <button
                className={`${styles.actionButton} ${styles.promoteButton}`}
                onClick={() => handleAdminToggle(true)}
                disabled={isUpdatingAdmin}
              >
                {isUpdatingAdmin ? (
                  <span className={styles.loadingContent}>
                    <Loader2 className={styles.spinner} size={16} />
                    Promoviendo...
                  </span>
                ) : (
                  "Hacer admin"
                )}
              </button>
            ) : (
              <button
                className={`${styles.actionButton} ${styles.removeButton}`}
                onClick={() => handleAdminToggle(false)}
                disabled={isUpdatingAdmin}
              >
                {isUpdatingAdmin ? (
                  <span className={styles.loadingContent}>
                    <Loader2 className={styles.spinner} size={16} />
                    Quitando...
                  </span>
                ) : (
                  "Quitar admin"
                )}
              </button>
            )}
          </div>
        </div>
      ) : trimmedSearch && statusMessage ? (
        <p className={styles.noResults}>{statusMessage}</p>
      ) : (
        <p className={styles.helperText}>
          Ingresa el identificador y presiona la lupa para buscar un usuario.
        </p>
      )}
    </div>
  );
};

export default AddAdminView;
