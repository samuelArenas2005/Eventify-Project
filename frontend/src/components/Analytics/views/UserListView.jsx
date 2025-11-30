import React from "react";
import { Users, Search } from "lucide-react";
import styles from "./UserListView.module.css";

/**
 * Vista de lista de usuarios reutilizable
 */
const UserListView = ({ users, title = "Lista de Inscritos" }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusText = (status) => {
    const statusMap = {
      confirmed: "Confirmado",
      pending: "Pendiente",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  return (
    <div className={styles.usersListView}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Users size={24} />
          {title} <span className={styles.userCount}>({users.length})</span>
        </h2>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            className={styles.searchInput}
          />
        </div>
      </div>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Fecha de Inscripción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.userCell}>
                  <div className={styles.userAvatar}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className={styles.userName}>{user.name}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span
                  className={`${styles.statusBadge} ${
                    styles[
                      `status${
                        user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)
                      }`
                    ]
                  }`}
                >
                  <span className={styles.statusIcon}></span>
                  {getStatusText(user.status)}
                </span>
              </td>
              <td>
                {new Date(user.registrationDate).toLocaleDateString("es-ES")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListView;
