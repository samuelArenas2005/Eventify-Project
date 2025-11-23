import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import {
    getUserNotifications,
    deleteUserNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../../API/api';
import './Notifications.css';

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    // Cargar notificaciones al montar
    useEffect(() => {
        fetchNotifications();

        // Opcional: Polling cada 60 segundos para nuevas notificaciones
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        const data = await getUserNotifications();
        if (data) {
            // Mapear la respuesta del backend al formato que usa el componente
            const mapped = data.map(n => ({
                id: n.id, // ID de UserNotification
                type: n.notification.type,
                text: n.notification.message,
                time: new Date(n.notification.sent_at).toLocaleString(), // Formato simple por ahora
                read: n.state === 'READ',
                thumbnail: n.notification.event?.images?.[0]?.image || null,
                // Datos extra si los necesitamos
                eventId: n.notification.event?.id
            }));
            setNotifications(mapped);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        const success = await deleteUserNotification(id);
        if (success) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    // Función para cerrar y marcar visualmente como leídas
    const handleClose = () => {
        setIsOpen(false);
        // Al cerrar, actualizamos el estado local para quitar los puntos azules y el badge
        if (notifications.some(n => !n.read)) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            // ABRIR
            setIsOpen(true);
            // Marcar como leídas en el BACKEND (fire and forget), pero NO actualizar visualmente todavía
            if (notifications.some(n => !n.read)) {
                markAllNotificationsAsRead();
            }
        } else {
            // CERRAR
            handleClose();
        }
    };

    const handleNotificationClick = (notif) => {
        // Ya no marcamos como leída al hacer click individualmente
        // Solo navegamos si es necesario
        // navigate(`/events/${notif.eventId}`);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const onClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Forzamos el cierre y la actualización visual
                setIsOpen(prevIsOpen => {
                    if (prevIsOpen) {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        return false;
                    }
                    return prevIsOpen;
                });
            }
        }

        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="notifications-container" ref={dropdownRef}>
            {/* Campana e Icono */}
            <div
                className="notification-bell"
                onClick={handleToggle}
                title="Notificaciones"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notificaciones</h3>
                    </div>

                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                No tienes notificaciones
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    {/* Indicador de no leído (punto azul) */}
                                    {!notif.read && <div className="unread-dot"></div>}

                                    {/* Icono por defecto (ya que no tenemos avatar de usuario en la notif aun) */}
                                    <div className="notification-icon-placeholder">
                                        <Bell size={20} />
                                    </div>

                                    {/* Contenido */}
                                    <div className="notification-content">
                                        <div
                                            className="notification-text"
                                            dangerouslySetInnerHTML={{ __html: notif.text }}
                                        />
                                        <span className="notification-time">{notif.time}</span>
                                    </div>

                                    {/* Thumbnail (opcional) */}
                                    {notif.thumbnail && (
                                        <img src={notif.thumbnail} alt="Event" className="notification-thumbnail" />
                                    )}

                                    {/* Icono de basura (eliminar) */}
                                    <div
                                        className="notification-delete"
                                        title="Eliminar notificación"
                                        onClick={(e) => handleDelete(e, notif.id)}
                                    >
                                        <Trash2 size={18} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
