import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import EventCard from '../../components/UI/EventCard/EventCard';
import { Edit, Settings, Calendar, User, Star, Filter,CirclePlus,Plus} from 'lucide-react';
import { getRegisteredEvents,getPendingEvents,getCreatedEvent } from './GetEventsData';

const historyData = [];

// --- Componente Principal ---
const UserProfileDashboard = ({user}) => {
  const [activeTab, setActiveTab] = useState('registrados');
  const [loading, setLoading] = useState(true);
  const [registeredEventsData, setregisteredEventsData] = useState([])
  const [pendingEventData, setpendingEventData] = useState([])
  const [myEventsData, setMyEventsData] = useState([])

  const FullName = user ? `${user.name} ${user.last_name}` : 'Usuario';
  const initials = user ? `${user.name.charAt(0)}${user.last_name.charAt(0)}` : 'UU';

  const handleFilterClick = () => {
    alert('Abrir modal de filtros');
  };

  console.log(user);
  

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const Registerdata = await getRegisteredEvents();
      const PendingData = await getPendingEvents();
      const CreatedData = await getCreatedEvent();
      setLoading(false);
      setregisteredEventsData(Registerdata)
      setpendingEventData(PendingData)
      setMyEventsData(CreatedData)
      console.log(Registerdata)
      console.log(PendingData)
      console.log(CreatedData)
    }

    loadEvents();
  }, []);

  if (loading) return <div>Cargando eventos...</div>;

  const renderContent = () => {
    let title = '';
    let data = [];
    let emptyMessage = '';
    let type = ''

    switch (activeTab) {
      case 'registrados':
        title = `Eventos Registrados (${registeredEventsData.length})`;
        data = registeredEventsData;
        emptyMessage = 'No estás registrado en ningún evento.';
        break;
      case 'megustas':
        title = `Eventos que te interesan (${pendingEventData.length})`;
        data = pendingEventData;
        emptyMessage = 'No te gusta ningún evento.';
        break;
      case 'misEventos':
        title = `Mis Eventos (${myEventsData.length})`;
        data = myEventsData;
        emptyMessage = 'No has creado ningún evento.';
        type = 'myevent'
        break;
      case 'historial':
        title = `Historial (${historyData.length})`;
        data = historyData;
        emptyMessage = 'No tienes eventos en tu historial.';
        break;
      default:
        return null;
    }

    return (
      <>
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>{title}</h2>
          <div className={styles.viewOptions}>
            {type == 'myevent' ? 
            <Link to="/createEvent" className={`${styles.actionButton} ${styles.createButton}`}>
              <Plus size={16} /> 
            </Link>
            :null}
            <button className={styles.filterButton} onClick={handleFilterClick}>
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>

        {data.length > 0 ? (
          <div className={`${styles.eventList} ${styles.grid}`}>
            {data.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <p>{emptyMessage}</p>
        )}
      </>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* --- Sección de Perfil Mejorada --- */}
      <header className={styles.profileHeader}>
        <div className={styles.profileMain}>
          <div className={styles.profileImageContainer}>
            {(user.avatar ? 
            <img src={user.avatar} alt="Avatar" className={styles.profileAvatar} /> :
            <div className={styles.profileInitials}>{initials}</div>)}
            <div className={styles.statusIndicator}></div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileTitle}>
              <h1>{FullName}</h1>
              <div className={styles.profileTags}>
                <span className={styles.roleTag}>{user.rol}</span>
                <span className={styles.codeTag}>{user.codigo}</span>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <p className={styles.emailText}>{user.email}</p>
              <div className={styles.profileStats}>
                <span className={styles.statItem}>
                  <Calendar size={14} />
                  <span>Miembro desde 2024</span>
                </span>
                <span className={styles.statItem}>
                  <Star size={14} />
                  <span>
                    {(user.is_active) ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.profileActions}>
          <Link to="/createEvent" className={`${styles.actionButton} ${styles.createButton}`}>
            <CirclePlus size={18} /> Crear Evento
          </Link>
          <button className={styles.actionButton}>
            <Edit size={18} /> Editar Perfil
          </button>
          <button className={styles.actionButton}>
            <Settings size={18} /> Configuración
          </button>
        </div>
      </header>

      {/* --- Sección de Estadísticas (Sin cambios) --- */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Eventos Asistidos</span>
            <strong>.</strong>
          </div>
          <div className={`${styles.statIcon} ${styles.iconEvents}`}>
            <Calendar size={24} />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Eventos Creados</span>
            <strong>.</strong>
          </div>
          <div className={`${styles.statIcon} ${styles.iconCreated}`}>
            <User size={24} />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Calificación Promedio</span>
            <strong>.</strong>
          </div>
          <div className={`${styles.statIcon} ${styles.iconRating}`}>
            <Star size={24} />
          </div>
        </div>
      </section>

      <nav className={styles.tabsNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'registrados' ? styles.active : ''}`}
          onClick={() => setActiveTab('registrados')}
        >
          Eventos Registrados
        </button>
         <button
          className={`${styles.tabButton} ${activeTab === 'megustas' ? styles.active : ''}`}
          onClick={() => setActiveTab('megustas')}
        >
          Eventos Favoritos
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'misEventos' ? styles.active : ''}`}
          onClick={() => setActiveTab('misEventos')}
        >
          Mis Eventos
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'historial' ? styles.active : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </button>
      </nav>

      {/* --- Sección de Contenido (Renderizado dinámico) --- */}
      <main className={styles.contentSection}>
        {renderContent()}
      </main>
    </div>
  );
};

export default UserProfileDashboard;