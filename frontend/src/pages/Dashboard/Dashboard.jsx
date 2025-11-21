import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import EventCard from '../../components/UI/EventCard/EventCard';
import { Edit, ChartColumnBig, Calendar, User, Star, Filter, CirclePlus, Plus, CalendarCheck2, X, ChevronDown, CheckCircle2, FileText, XCircle, Archive } from 'lucide-react';
import { getRegisteredEvents, getPendingEvents, getCreatedEvent } from './GetEventsData';
import { getAllRegisteredEventsCount, getAllCreatedEventsCount } from '../../API/api';
import EventDashboard from '../../components/UI/EventCreate/EventForm'
import Loanding from '../../components/UI/Loanding/Loanding';
import ModalQr from '../../components/UI/modalQR/ModalQr';
import ScanQr from '../../components/UI/ScanQr/ScanQr';

const historyData = [];

// --- Componente Principal ---
const UserProfileDashboard = ({ user }) => {
  const navigate = useNavigate();
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
  
  // Estados para filtros de "Mis Eventos"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  const FullName = user ? `${user.name} ${user.last_name}` : 'Usuario';
  const initials = user ? `${user.name.charAt(0)}${user.last_name.charAt(0)}` : 'UU';
  const dateRegister = user ? `${user.date_joined.substring(0, 4)}` : 'fecha no disponible';

  const hardRefresh = () => {
    window.location.reload(true);
  };

  const toggleFilter = () => {
    setIsFilterOpen((prevState) => !prevState);
  };

  const clearFilters = () => {
    setSelectedStatusFilter("");
  };

  const removeStatusFilter = () => {
    setSelectedStatusFilter("");
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
      
      // Contar solo eventos ACTIVE y FINISHED (no DRAFT ni CANCELLED)
      const activeAndFinishedCount = allCreated.data.filter(
        event => event.status === 'ACTIVE' || event.status === 'FINISHED'
      ).length;
      setTotalCreatedCount(activeAndFinishedCount);
      console.log(user)
    }

    loadEvents();
  }, []);

  if (loading) return <Loanding />;

  // Función para obtener eventos filtrados por status
  const getEventsByStatus = (status) => {
    return myEventsData.filter(event => event.status === status);
  };

  // Función para obtener el nombre traducido del status
  const getStatusLabel = (status) => {
    const statusMap = {
      'ACTIVE': 'Activos',
      'DRAFT': 'Borradores',
      'CANCELLED': 'Cancelados',
      'FINISHED': 'Finalizados'
    };
    return statusMap[status] || status;
  };

  // Función para obtener el icono del status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return CheckCircle2;
      case 'DRAFT':
        return FileText;
      case 'CANCELLED':
        return XCircle;
      case 'FINISHED':
        return Archive;
      default:
        return Calendar;
    }
  };

  // Obtener filtros activos
  const activeFilters = [];
  if (selectedStatusFilter) {
    const StatusIcon = getStatusIcon(selectedStatusFilter);
    activeFilters.push({
      type: "status",
      label: "Estado",
      value: getStatusLabel(selectedStatusFilter),
      onRemove: removeStatusFilter,
      icon: StatusIcon,
    });
  }

  // Filtrar eventos según el filtro seleccionado
  const getFilteredEvents = () => {
    if (!selectedStatusFilter) {
      return myEventsData;
    }
    return myEventsData.filter(event => event.status === selectedStatusFilter);
  };

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

    // Render especial para "Mis Eventos" con secciones por status
    if (type === 'myevent') {
      const activeEvents = getEventsByStatus('ACTIVE');
      const draftEvents = getEventsByStatus('DRAFT');
      const cancelledEvents = getEventsByStatus('CANCELLED');
      const finishedEvents = getEventsByStatus('FINISHED');
      
      const filteredEvents = getFilteredEvents();
      const shouldShowFiltered = selectedStatusFilter && filteredEvents.length > 0;

      return (
        <>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>{title}</h2>
            <div className={styles.viewOptions}>
              <button onClick={openCreatePanel} className={`${styles.actionButton} ${styles.createButton}`}>
                <Plus size={16} />
              </button>
              <div className={styles.filterContainer}>
                <button
                  className={styles.filterButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter();
                  }}
                >
                  <Filter size={16} />
                  Filtrar
                </button>
                {isFilterOpen && (
                  <div
                    className={styles.filterDropdown}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.filterHeader}>
                      <h3>Filtrar por estado</h3>
                      <button className={styles.clearButton} onClick={clearFilters}>
                        Limpiar
                      </button>
                    </div>

                    <div className={styles.filterSection}>
                      <label className={styles.filterLabel}>
                        <CheckCircle2 size={18} />
                        Estado del evento
                      </label>
                      <div className={styles.selectWrapper}>
                        <select
                          className={styles.filterSelect}
                          value={selectedStatusFilter}
                          onChange={(e) => {
                            setSelectedStatusFilter(e.target.value);
                            setIsFilterOpen(false);
                          }}
                        >
                          <option value="">Todos los estados</option>
                          <option value="ACTIVE">Activos</option>
                          <option value="DRAFT">Borradores</option>
                          <option value="CANCELLED">Cancelados</option>
                          <option value="FINISHED">Finalizados</option>
                        </select>
                        <ChevronDown className={styles.selectIcon} size={18} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filtros aplicados */}
          {activeFilters.length > 0 && (
            <div className={styles.activeFiltersContainer}>
              {activeFilters.map((filter, index) => {
                const IconComponent = filter.icon;
                return (
                  <div key={index} className={styles.activeFilterTag}>
                    <IconComponent size={14} className={styles.filterTagIcon} />
                    <span className={styles.filterTagLabel}>{filter.label}:</span>
                    <span className={styles.filterTagValue}>{filter.value}</span>
                    <button
                      className={styles.filterTagRemove}
                      onClick={filter.onRemove}
                      aria-label={`Eliminar filtro ${filter.label}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Si hay un filtro aplicado, mostrar solo eventos filtrados */}
          {shouldShowFiltered ? (
            <div className={`${styles.eventList} ${styles.grid}`}>
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event}
                  handleQRCodeClick={() => handleQRCodeClick(event)}
                  handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Sección de Eventos Activos */}
              {activeEvents.length > 0 && (
                <div className={styles.statusSection}>
                  <div className={styles.statusSectionHeader}>
                    <CheckCircle2 size={24} className={styles.statusIconActive} />
                    <h3 className={styles.statusSectionTitle}>
                      Eventos Activos ({activeEvents.length})
                    </h3>
                  </div>
                  <div className={`${styles.eventList} ${styles.grid}`}>
                    {activeEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        {...event}
                        handleQRCodeClick={() => handleQRCodeClick(event)}
                        handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Borradores */}
              {draftEvents.length > 0 && (
                <div className={styles.statusSection}>
                  <div className={styles.statusSectionHeader}>
                    <FileText size={24} className={styles.statusIconDraft} />
                    <h3 className={styles.statusSectionTitle}>
                      Borradores ({draftEvents.length})
                    </h3>
                  </div>
                  <div className={`${styles.eventList} ${styles.grid}`}>
                    {draftEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        {...event}
                        handleQRCodeClick={() => handleQRCodeClick(event)}
                        handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Eventos Cancelados */}
              {cancelledEvents.length > 0 && (
                <div className={styles.statusSection}>
                  <div className={styles.statusSectionHeader}>
                    <XCircle size={24} className={styles.statusIconCancelled} />
                    <h3 className={styles.statusSectionTitle}>
                      Eventos Cancelados ({cancelledEvents.length})
                    </h3>
                  </div>
                  <div className={`${styles.eventList} ${styles.grid}`}>
                    {cancelledEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        {...event}
                        handleQRCodeClick={() => handleQRCodeClick(event)}
                        handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Eventos Finalizados */}
              {finishedEvents.length > 0 && (
                <div className={styles.statusSection}>
                  <div className={styles.statusSectionHeader}>
                    <Archive size={24} className={styles.statusIconFinished} />
                    <h3 className={styles.statusSectionTitle}>
                      Eventos Finalizados ({finishedEvents.length})
                    </h3>
                  </div>
                  <div className={`${styles.eventList} ${styles.grid}`}>
                    {finishedEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        {...event}
                        handleQRCodeClick={() => handleQRCodeClick(event)}
                        handleReadQrCodeClick={() => handleReadQrCodeClick(event)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay eventos */}
              {activeEvents.length === 0 && draftEvents.length === 0 && 
               cancelledEvents.length === 0 && finishedEvents.length === 0 && (
                <p className={styles.emptyMessage}>{emptyMessage}</p>
              )}
            </>
          )}
        </>
      );
    }

    // Render normal para otros tabs
    return (
      <>
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>{title}</h2>
          <div className={styles.viewOptions}>
            <button className={styles.filterButton} onClick={toggleFilter}>
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
          <p className={styles.emptyMessage}>{emptyMessage}</p>
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
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/editProfile')}
          >
            <Edit size={18} /> Editar Perfil
          </button>
          <button className={styles.actionButton}>
            <ChartColumnBig size={18} /> Analytics
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
        redirection={hardRefresh}
      />

    </div>
  );
};

export default UserProfileDashboard;