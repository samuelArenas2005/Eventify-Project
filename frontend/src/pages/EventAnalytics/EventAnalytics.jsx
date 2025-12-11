import { Users, TrendingUp, MessageCircle } from "lucide-react";
import AnalyticsLayout from "../../components/Analytics/layout/AnalyticsLayout";
import EventAnalyticsHeader from "../../components/Analytics/headers/EventAnalyticsHeader";
import UserListView from "../../components/Analytics/views/UserListView";
import TimeSeriesChart from "../../components/Analytics/charts/TimeSeriesChart";
// import CommentsPlaceholder from "../../components/Analytics/views/CommentsPlaceholder"; // YA NO LO NECESITAMOS
import CommentsListView from "../../components/Analytics/views/CommentsListView"; // IMPORTAMOS EL NUEVO
import { Edit } from 'lucide-react';
import { Pencil } from 'lucide-react';
import ModifyEventView from "../../components/Analytics/views/modifyEventView";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
// IMPORTANTE: Agregamos getEventRatings aquí
import { getEventById, getEventAttendees, getEventRatings } from '../../api/api';
import { Loader2 } from 'lucide-react';
import styles from './EventAnalytics.module.css'; // Asegúrate de importar los estilos como objeto si usas modules

const EventAnalytics = () => {
  const [activeView, setActiveView] = useState("users");
  const { eventId } = useParams();
  const [formattedEventData, setFormattedEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);

  // NUEVOS ESTADOS PARA COMENTARIOS
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // 1. Cargar datos del evento (Header)
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;
      try {
        const data = await getEventById(eventId);
        if (data) {
          const startDateObj = new Date(data.start_date);
          const endDateObj = new Date(data.end_date);

          const formattedData = {
            title: data.title,
            description: data.description,
            startDate: startDateObj.toISOString().split('T')[0],
            startTime: startDateObj.toTimeString().slice(0, 5),
            endDate: endDateObj.toISOString().split('T')[0],
            endTime: endDateObj.toTimeString().slice(0, 5),
            address: data.address,
            venueInfo: data.location_info,
            capacity: data.capacity,
            category: data.category?.id?.toString(),
            images: []
          };

          // Lógica de imágenes (igual que tenías)
          if (data.images && Array.isArray(data.images)) {
            // ... tu lógica de imagenes existente ...
            // Para simplificar el ejemplo aquí asumo que funciona igual
            // Si necesitas el bloque completo de imagenes dímelo, pero lo dejé igual en tu código
          } else if (data.main_image) {
            // ... tu lógica main_image ...
            const response = await fetch(data.main_image);
            const blob = await response.blob();
            const file = new File([blob], 'main_image.jpg', { type: blob.type });
            formattedData.images = [{ url: URL.createObjectURL(file), file: file }];
          }
          setFormattedEventData(formattedData);
        }
      } catch (error) {
        console.error("Error al obtener el evento:", error);
        toast.error("No se pudo cargar la información del evento");
      }
    };
    fetchEventData();
  }, [eventId]);

  // 2. Cargar Inscritos o Comentarios según la vista activa
  useEffect(() => {
    const fetchDataByView = async () => {
      if (!eventId) return;

      // A) Si la vista es USUARIOS
      if (activeView === "users") {
        try {
          const data = await getEventAttendees(eventId);
          const formattedAttendees = data.map(attendee => ({
            id: attendee.user?.id || attendee.id,
            name: attendee.user?.name
              ? `${attendee.user.name} ${attendee.user.last_name || ''}`.trim()
              : attendee.user?.username || 'Usuario',
            email: attendee.user?.email || 'No disponible',
            status: attendee.status || 'CONFIRMED',
            registrationDate: attendee.created_at
              ? new Date(attendee.created_at).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }));
          setAttendees(formattedAttendees);
        } catch (error) {
          console.error("Error inscritos:", error);
          toast.error("Error al cargar inscritos");
        }
      }

      // B) Si la vista es COMENTARIOS (NUEVO)
      if (activeView === "comments") {
        setLoadingComments(true);
        try {
          const data = await getEventRatings(eventId);
          setComments(data);
        } catch (error) {
          console.error("Error comentarios:", error);
          toast.error("Error al cargar comentarios");
        } finally {
          setLoadingComments(false);
        }
      }
    };

    fetchDataByView();
  }, [eventId, activeView]);

  // Datos para el Header lateral
  const eventData = {
    title: formattedEventData?.title,
    date: formattedEventData?.startDate,
    attendees: attendees.length > 0 ? `${attendees.length} inscritos` : "Cargando...",
    image: formattedEventData?.images[0]?.url,
  };

  const menuItems = [
    { id: "Modificar_evento", icon: <Pencil size={20} />, label: "Modificar evento" },
    { id: "users", icon: <Users size={20} />, label: "Lista de Inscritos" },
    { id: "registrations", icon: <TrendingUp size={20} />, label: "Inscripciones por Día" },
    { id: "comments", icon: <MessageCircle size={20} />, label: "Comentarios" }
  ];

  // Datos chart (igual que tenías)
  const chartData = [{ label: "15 Nov", value: 5 } /* ... resto de tus datos ... */];
  const chartStats = [ /* ... tus datos stats ... */];

  const renderContent = () => {
    if (activeView === "users") {
      return <UserListView users={attendees} />;
    }
    if (activeView === "registrations") {
      return (
        <TimeSeriesChart
          data={chartData}
          title="Inscripciones por Día"
          subtitle="Desde la publicación del evento"
          stats={chartStats}
        />
      );
    }
    // NUEVO RENDERIZADO
    if (activeView === "comments") {
      return (
        <CommentsListView
          comments={comments}
          loading={loadingComments}
          styles={styles} // Pasamos los estilos al hijo
        />
      );
    }
    if (activeView === "Modificar_evento") {
      return <ModifyEventView event={formattedEventData} />
    }
    return null;
  };

  return (
    <AnalyticsLayout
      sidebarHeader={<EventAnalyticsHeader eventData={eventData} />}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {renderContent()}
    </AnalyticsLayout>
  );
};

export default EventAnalytics;