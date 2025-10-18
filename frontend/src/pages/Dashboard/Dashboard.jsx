import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import EventCard from '../../components/UI/EventCard/EventCard';
import { Edit, Settings, Calendar, User, Star, Filter,CirclePlus,Plus} from 'lucide-react';
import { getRegisteredEvents,getPendingEvents,getCreatedEvent } from './GetEventsData';

const historyData = [];

// --- Componente Principal ---
const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('registrados');
  const [loading, setLoading] = useState(true);
  const [registeredEventsData, setregisteredEventsData] = useState([])
  const [pendingEventData, setpendingEventData] = useState([])
  const [myEventsData, setMyEventsData] = useState([])

  const handleFilterClick = () => {
    alert('Abrir modal de filtros');
  };

  

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
      {/* --- Sección de Perfil (Sin cambios) --- */}
      <header className={styles.profileHeader}>
        <div className={styles.profileInitials}>JP</div>
        <div className={styles.profileInfo}>
          <h1>Juan Pérez</h1>
          <p>juan.perez@universidad.edu.co</p>
          <div className={styles.profileTags}>
            <span>Ingeniería de Sistemas</span>
            <span>8vo Semestre</span>
          </div>
        </div>
        <div className={styles.profileActions}>
          <Link to="/createEvent" className={`${styles.actionButton} ${styles.createButton}`}>
            <CirclePlus size={16} /> Crear Evento
          </Link>
          <button className={styles.actionButton}>
            <Edit size={16} /> Editar Perfil
          </button>
          <button className={styles.actionButton}>
            <Settings size={16} /> Configuración
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