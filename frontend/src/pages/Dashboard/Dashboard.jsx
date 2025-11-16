import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import EventCard from '../../components/UI/EventCard/EventCard';
import { Edit, Settings, Calendar, User, Star, Filter, CirclePlus, Plus, CalendarCheck2 } from 'lucide-react';
import { getRegisteredEvents, getPendingEvents, getCreatedEvent } from './GetEventsData';
import { getAllRegisteredEventsCount, getAllCreatedEventsCount } from '../../API/api';
import EventDashboard from '../../components/UI/EventCreate/EventForm'
import Loanding from '../../components/UI/Loanding/Loanding';
import ModalQr from '../../components/UI/modalQR/ModalQr';
import ScanQr from '../../components/UI/ScanQr/ScanQr';

const historyData = [];

// --- Componente Principal ---
const UserProfileDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('registrados');
  const [loading, setLoading] = useState(true);
  const [registeredEventsData, setregisteredEventsData] = useState([])
  const [pendingEventData, setpendingEventData] = useState([])
  const [myEventsData, setMyEventsData] = useState([])
  const [totalRegisteredCount, setTotalRegisteredCount] = useState(0);
  const [totalCreatedCount, setTotalCreatedCount] = useState(0);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isCreatePanelClosing, setIsCreatePanelClosing] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedEventForQR, setSelectedEventForQR] = useState(null);
  const [isScanQRModalOpen, setIsScanQRModalOpen] = useState(false);
  const [selectedEventForScan, setSelectedEventForScan] = useState(null);

  const FullName = user ? `${user.name} ${user.last_name}` : 'Usuario';
  const initials = user ? `${user.name.charAt(0)}${user.last_name.charAt(0)}` : 'UU';
  const dateRegister = user ? `${user.date_joined.substring(0, 4)}` : 'fecha no disponible';

  const handleFilterClick = () => {
    alert('Abrir modal de filtros');
  };

  // Abrir panel de creación: limpiar estado de cierre
  const openCreatePanel = () => {
    setIsCreatePanelClosing(false);
    setIsCreatePanelOpen(true);
  };


  // Iniciar cierre: quitar estado 'open' y marcar 'closing' para permitir la animación
  const closeCreatePanel = () => {
    // marcar como no abierto y como cerrándose
    setIsCreatePanelOpen(false);
    setIsCreatePanelClosing(true);

    setTimeout(() => {
      setIsCreatePanelClosing(false);
      setActiveTab('misEventos');
    }, 220);
  };

  // Manejar apertura del modal QR
  const handleQRCodeClick = (event) => {
    setSelectedEventForQR({
      id: event.id,
      title: event.title
    });
    setIsQRModalOpen(true);
  };

  // Manejar cierre del modal QR
  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
    setSelectedEventForQR(null);
  };

  // Manejar apertura del modal de escaneo QR
  const handleReadQrCodeClick = (event) => {
    setSelectedEventForScan({
      id: event.id,
      title: event.title
    });
    setIsScanQRModalOpen(true);
  };

  // Manejar cierre del modal de escaneo QR
  const handleCloseScanQRModal = () => {
    setIsScanQRModalOpen(false);
    setSelectedEventForScan(null);
  };

  console.log(user);


  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const Registerdata = await getRegisteredEvents();
      const PendingData = await getPendingEvents();
      const CreatedData = await getCreatedEvent();

      // Nuevas llamadas para contar todos los eventos (activos + finalizados)
      const allRegistered = await getAllRegisteredEventsCount();
      const allCreated = await getAllCreatedEventsCount();

      setLoading(false);
      setregisteredEventsData(Registerdata)
      setpendingEventData(PendingData)
      setMyEventsData(CreatedData)
      setTotalRegisteredCount(allRegistered.data.length);
      setTotalCreatedCount(allCreated.data.length);
      console.log(user)
    }

    loadEvents();
  }, []);

  if (loading) return <Loanding />;

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
              <button onClick={openCreatePanel} className={`${styles.actionButton} ${styles.createButton}`}>
                <Plus size={16} />
              </button>
              : null}
            <button className={styles.filterButton} onClick={handleFilterClick}>
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>

        {data.length > 0 ? (
          <div className={`${styles.eventList} ${styles.grid}`}>
            {data.map((event) => (
              <EventCard 
                key={event.id} 
                {...event}
                handleQRCodeClick={() => handleQRCodeClick(event)}
                handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
              />
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
                <span className={styles.codeTag}>{user.codigo || user.cedula}</span>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <p className={styles.emailText}>{user.email}</p>
              <div className={styles.profileStats}>
                <span className={styles.statItem}>
                  <Calendar size={14} />
                  <span>Miembro desde {dateRegister}</span>
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
            <b>{totalRegisteredCount || '0'}</b>
          </div>
          <div className={`${styles.statIcon} ${styles.iconEvents}`}>
            <CalendarCheck2 size={25} />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Eventos Creados</span>
            <b>{totalCreatedCount || '0'}</b>
          </div>
          <div className={`${styles.statIcon} ${styles.iconCreated}`}>
            <User size={25} />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Calificación Promedio</span>
            <b>0</b>
          </div>
          <div className={`${styles.statIcon} ${styles.iconRating}`}>
            <Star size={25} />
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
      {(isCreatePanelOpen || isCreatePanelClosing) ?
        <div className={`${styles.modalOverlay} ${isCreatePanelOpen ? styles.show : ""} ${isCreatePanelClosing ? styles.closing : ""}`}>
          <div className={`${styles.quickCreatePanel} ${styles.modalPanel}`}>
            <div className={styles.modalContent}>
              <EventDashboard onClose={closeCreatePanel} />
            </div>
          </div>
        </div> : null}

      {/* Modal QR */}
      <ModalQr
        isOpen={isQRModalOpen}
        onClose={handleCloseQRModal}
        eventId={selectedEventForQR?.id}
        eventTitle={selectedEventForQR?.title}
      />

      {/* Modal Scan QR */}
      <ScanQr
        isOpen={isScanQRModalOpen}
        onClose={handleCloseScanQRModal}
        eventId={selectedEventForScan?.id}
      />

    </div>
  );
};

export default UserProfileDashboard;