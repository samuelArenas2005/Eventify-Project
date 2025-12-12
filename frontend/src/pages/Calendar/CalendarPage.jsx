import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info, Compass } from 'lucide-react';
import styles from './CalendarPage.module.css';
import { getEventRegisteredUser, getAllEvents } from '../../api/api';
import EventDetailModal from '../../components/UI/DetailedEvent/DetailedEvent';
import { Loader2 } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // INTERACCIÓN
    // Inicializamos en null para mostrar "Eventos Cercanos" por defecto
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [modalData, setModalData] = useState(null);

    // --- 1. CARGA DE DATOS (PÚBLICOS + REGISTRADOS) ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Ejecutamos ambas peticiones en paralelo
                // Nota: getAllEvents trae eventos activos donde NO estoy registrado
                // getEventRegisteredUser trae eventos donde SI estoy registrado
                const [publicData, registeredData] = await Promise.allSettled([
                    getAllEvents(),
                    getEventRegisteredUser()
                ]);

                let combinedEvents = [];

                // 1. Procesar eventos públicos (Explore)
                if (publicData.status === 'fulfilled' && Array.isArray(publicData.value)) {
                    const publicFormatted = publicData.value.map(ev => ({
                        ...ev,
                        isRegistered: false // Marca visual
                    }));
                    combinedEvents = [...combinedEvents, ...publicFormatted];
                }

                // 2. Procesar eventos registrados (Si el usuario está logueado)
                if (registeredData.status === 'fulfilled' && registeredData.value && Array.isArray(registeredData.value.data)) {
                    // Nota: getEventRegisteredUser devuelve { data: [...] } o array directo dependiendo de tu axios config.
                    // Asumiré que viene como en tu código anterior: response.data
                    const regList = registeredData.value.data || registeredData.value;

                    const registeredFormatted = regList.map(item => ({
                        ...item.event, // Aplanamos el objeto
                        attendanceStatus: item.status,
                        isRegistered: true // Marca visual
                    }));
                    combinedEvents = [...combinedEvents, ...registeredFormatted];
                }

                setEvents(combinedEvents);

            } catch (error) {
                console.error("Error cargando calendario global:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // --- LÓGICA CALENDARIO ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getEventsForDay = (dayDate) => {
        if (!dayDate) return [];
        return events.filter(event => isSameDay(event.start_date, dayDate));
    };

    // --- LÓGICA "PRÓXIMOS EVENTOS" (Cuando no hay día seleccionado) ---
    const getUpcomingEvents = () => {
        const now = new Date();
        // Filtramos eventos futuros y ordenamos por fecha ascendente
        return events
            .filter(ev => new Date(ev.start_date) >= now)
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
            .slice(0, 10); // Mostramos solo los 10 más cercanos
    };

    const handleDayClick = (day) => {
        if (day) setSelectedDate(day);
    };

    const handleEventClick = (event) => {
        // Preparar datos para el modal
        const formatted = {
            id: event.id,
            titulo: event.title,
            descripcion: event.description,
            imag: event.images || (event.main_image ? [{ image: event.main_image }] : []),
            fechaInicio: event.start_date,
            fechaFin: event.end_date,
            direccion: event.address,
            capacidad: event.capacity,
            asistentes: event.attendees_count,
            organizador: event.creator?.username || "Organizador",
            categoria: event.category?.name || "General",
            estado: event.status || "Activo",
            local_info: event.location_info,
            fechaCreacion: event.created_at,
            myRating: event.my_rating,
            showBorrar: false,
            showRegistrar: !event.isRegistered, // Mostrar botón registrar si no lo está
        };

        setModalData(formatted);
        setSelectedEventId(event.id);
    };

    const closeModals = () => {
        setSelectedEventId(null);
        setModalData(null);
    };

    // Variables de renderizado
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const daysToRender = getDaysInMonth(currentDate);

    // Decisión: ¿Qué lista mostrar a la derecha?
    const displayEvents = selectedDate ? getEventsForDay(selectedDate) : getUpcomingEvents();
    const displayTitle = selectedDate
        ? `Eventos del ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`
        : "Próximos Eventos Cercanos";

    if (loading) return <div className={styles.loaderContainer}><Loader2 className={styles.spinner} /></div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>

                {/* CALENDARIO */}
                <div className={styles.calendarSection}>
                    <div className={styles.header}>
                        <div className={styles.titleContainer}>
                            <CalendarIcon className={styles.iconTitle} size={24} />
                            <h1 className={styles.pageTitle}>Calendario de Eventos</h1>
                        </div>
                        <div className={styles.controls}>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={styles.navButton}>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className={styles.currentMonth}>
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={styles.navButton}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.weekDaysGrid}>
                        {weekDays.map(day => <div key={day} className={styles.weekDayName}>{day}</div>)}
                    </div>

                    <div className={styles.daysGrid}>
                        {daysToRender.map((day, index) => {
                            const dayEvents = getEventsForDay(day);
                            const isToday = isSameDay(day, new Date());
                            const isSelected = isSameDay(day, selectedDate);

                            return (
                                <div
                                    key={index}
                                    className={`
                    ${styles.dayCell} 
                    ${!day ? styles.emptyCell : ''} 
                    ${isToday ? styles.todayCell : ''}
                    ${isSelected ? styles.selectedCell : ''}
                  `}
                                    onClick={() => handleDayClick(day)}
                                >
                                    {day && (
                                        <>
                                            <span className={styles.dayNumber}>{day.getDate()}</span>
                                            <div className={styles.eventDots}>
                                                {dayEvents.map((ev, i) => (
                                                    <span
                                                        key={i}
                                                        className={`
                              ${styles.dot} 
                              ${ev.isRegistered ? styles.dotRegistered : styles.dotPublic}
                            `}
                                                        title={ev.title}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotRegistered}`}></span> Inscrito</div>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotPublic}`}></span> Disponible</div>
                    </div>
                </div>

                {/* LISTA DE EVENTOS (Próximos o del día) */}
                <div className={styles.detailsSection}>
                    <div className={styles.detailsHeader}>
                        {selectedDate ? <Clock size={20} className={styles.headerIcon} /> : <Compass size={20} className={styles.headerIcon} />}
                        <h3 className={styles.detailsTitle}>{displayTitle}</h3>
                        {selectedDate && (
                            <button className={styles.clearFilterBtn} onClick={() => setSelectedDate(null)} title="Ver todos los próximos">
                                Ver próximos
                            </button>
                        )}
                    </div>

                    <div className={styles.eventsList}>
                        {displayEvents.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Info size={40} className={styles.emptyIcon} />
                                <p>{selectedDate ? "No hay eventos este día." : "No hay eventos próximos."}</p>
                            </div>
                        ) : (
                            displayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className={`${styles.eventCard} ${event.status === 'FINISHED' ? styles.eventFinished : ''}`}
                                    onClick={() => handleEventClick(event)}
                                >
                                    {/* Etiqueta de fecha si estamos en vista de "Próximos" */}
                                    {!selectedDate && (
                                        <div className={styles.dateBadge}>
                                            {new Date(event.start_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                        </div>
                                    )}

                                    <div className={styles.eventTimeBox}>
                                        <Clock size={14} />
                                        <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {event.isRegistered && <span className={styles.registeredBadge}>Inscrito</span>}
                                    </div>

                                    <div className={styles.eventInfo}>
                                        <h4 className={styles.eventCardTitle}>{event.title}</h4>
                                        <div className={styles.eventLocation}>
                                            <MapPin size={12} /> {event.address || "Por definir"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {selectedEventId && modalData && (
                <EventDetailModal
                    {...modalData}
                    onClose={closeModals}
                />
            )}
        </div>
    );
};

export default CalendarPage;