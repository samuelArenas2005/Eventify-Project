import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import styles from './CalendarPage.module.css';
import { getEventRegisteredUser } from '../../api/api';
import EventDetailModal from '../../components/UI/DetailedEvent/DetailedEvent'; // Ajusta la ruta si es necesario
import { Loader2 } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para la interacción
    const [selectedDate, setSelectedDate] = useState(new Date()); // Por defecto el día de hoy
    const [selectedEventId, setSelectedEventId] = useState(null); // Para el modal
    const [modalData, setModalData] = useState(null); // Datos formateados para el modal

    // Cargar eventos registrados
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEventRegisteredUser();
                // La API devuelve un array de objetos { event: { ... }, status: ... }
                // Mapeamos para tener una estructura más limpia
                const formatted = response.data.map(item => ({
                    ...item.event,
                    attendanceStatus: item.status, // Guardamos el estado (REGISTERED, CONFIRMED, etc)
                    rawOriginal: item // Guardamos referencia completa por si acaso
                }));
                setEvents(formatted);
            } catch (error) {
                console.error("Error cargando eventos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // --- Lógica de Calendario ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Ajustar lunes como primer día (0=Lunes en mi grid, JS 0=Domingo)
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

    const handleDayClick = (day) => {
        if (day) setSelectedDate(day);
    };

    const handleEventClick = (event) => {
        // Formatear datos para el modal DetailedEvent
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
            organizador: event.creator?.username || "Desconocido",
            categoria: event.category?.name || "Evento",
            estado: event.status,
            local_info: event.location_info,
            fechaCreacion: event.created_at,
            myRating: event.my_rating, // Para ver y crear comentarios
            showBorrar: false, // En calendario solo visualizamos
            showRegistrar: false
        };

        setModalData(formatted);
        setSelectedEventId(event.id);
    };

    const closeModals = () => {
        setSelectedEventId(null);
        setModalData(null);
    };

    // Renderizado
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const daysToRender = getDaysInMonth(currentDate);
    const selectedDayEvents = getEventsForDay(selectedDate);

    if (loading) return <div className={styles.loaderContainer}><Loader2 className={styles.spinner} /></div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>

                {/* COLUMNA IZQUIERDA: CALENDARIO */}
                <div className={styles.calendarSection}>
                    <div className={styles.header}>
                        <div className={styles.titleContainer}>
                            <CalendarIcon className={styles.iconTitle} size={24} />
                            <h1 className={styles.pageTitle}>Planificación</h1>
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
                                            {/* Puntos indicadores de eventos */}
                                            <div className={styles.eventDots}>
                                                {dayEvents.map(ev => (
                                                    <span key={ev.id} className={`${styles.dot} ${ev.status === 'FINISHED' ? styles.dotFinished : ''}`} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMNA DERECHA: DETALLES DEL DÍA */}
                <div className={styles.detailsSection}>
                    <h3 className={styles.detailsTitle}>
                        {selectedDate
                            ? `Eventos del ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`
                            : "Selecciona un día"}
                    </h3>

                    <div className={styles.eventsList}>
                        {selectedDayEvents.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Info size={40} className={styles.emptyIcon} />
                                <p>No tienes eventos inscritos para este día.</p>
                            </div>
                        ) : (
                            selectedDayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className={`${styles.eventCard} ${event.status === 'FINISHED' ? styles.eventFinished : ''}`}
                                    onClick={() => handleEventClick(event)}
                                >
                                    <div className={styles.eventTimeBox}>
                                        <Clock size={14} />
                                        <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={styles.eventInfo}>
                                        <h4 className={styles.eventCardTitle}>{event.title}</h4>
                                        <div className={styles.eventLocation}>
                                            <MapPin size={12} /> {event.address || "Ubicación por definir"}
                                        </div>
                                        {event.status === 'FINISHED' && <span className={styles.badgeFinished}>Finalizado</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL DETALLES */}
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