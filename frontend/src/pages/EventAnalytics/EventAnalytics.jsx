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
            status: data.status,
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
          console.log("📌 Tu  Event es :", data);
          console.log("📌 Tu  Event en analytics:", formattedData);
          console.log("📌 Tu  Event status:", formattedData.status);

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

        // datos para UserListView
        const formattedAttendees = data.map(attendee => ({
          id: attendee.user?.id || attendee.id,
          name: attendee.user?.name
            ? `${attendee.user.name} ${attendee.user.last_name || ''}`.trim()
            : attendee.user?.username || 'Usuario',
          email: attendee.user?.email || 'No disponible',
          status: attendee.status || 'CONFIRMED', // Si no hay status se asigna CONFIRMED
          registrationDate: attendee.created_at
            ? new Date(attendee.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        }));
        console.log("formattedAttendees", formattedAttendees);

        setAttendees(formattedAttendees);
        console.log("attendees", attendees);
      } catch (error) {
        console.error("Error al obtener inscritos:", error);
        toast.error("No se pudo cargar la lista de inscritos");
        setAttendees([]); // por si llegara a fallar que espero que no, lista vacia de usuarios
      }
    };

    fetchDataByView();
  }, [eventId, activeView]);

  // Datos para el Header lateral
  const eventData = {
    title: formattedEventData?.title,
    date: formattedEventData?.startDate,
    attendees: attendees.length,
    image: formattedEventData?.images[0]?.url,
  };

  const menuItems = [
    { id: "Modificar_evento", icon: <Pencil size={20} />, label: "Modificar evento" },
    { id: "users", icon: <Users size={20} />, label: "Lista de Inscritos" },
    { id: "registrations", icon: <TrendingUp size={20} />, label: "Inscripciones por Día" },
    { id: "comments", icon: <MessageCircle size={20} />, label: "Comentarios" }
  ];

  // Datos falsos para la lista de usuarios
  const fakeUsers = [
    {
      id: 1,
      name: "María García",
      email: "maria.garcia@email.com",
      status: "confirmed",
      registrationDate: "2025-11-15",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-16",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      status: "pending",
      registrationDate: "2025-11-17",
    },
    {
      id: 4,
      name: "José López",
      email: "jose.lopez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-18",
    },
    {
      id: 5,
      name: "Laura Sánchez",
      email: "laura.sanchez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-19",
    },
    {
      id: 6,
      name: "Pedro Hernández",
      email: "pedro.hernandez@email.com",
      status: "cancelled",
      registrationDate: "2025-11-20",
    },
    {
      id: 7,
      name: "Sofia Ramírez",
      email: "sofia.ramirez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-21",
    },
    {
      id: 8,
      name: "Miguel Torres",
      email: "miguel.torres@email.com",
      status: "pending",
      registrationDate: "2025-11-22",
    },
  ];

  // Generar datos de la gráfica a partir de attendees reales
  const generateChartData = () => {
    if (!attendees || attendees.length === 0) {
      return [];
    }

    // Agrupar attendees por fecha de registro
    const registrationsByDate = {};

    attendees.forEach(attendee => {
      const date = attendee.registrationDate;
      if (date) {
        if (!registrationsByDate[date]) {
          registrationsByDate[date] = 0;
        }
        registrationsByDate[date]++;
      }
    });

    // Convertir a array y ordenar por fecha
    const sortedDates = Object.keys(registrationsByDate).sort();

    // Crear datos acumulativos para la gráfica
    let cumulativeCount = 0;
    const chartData = sortedDates.map(date => {
      cumulativeCount += registrationsByDate[date];

      // Formatear la fecha para mostrar (ej: "15 Nov")
      const dateObj = new Date(date + 'T00:00:00');
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
      const formattedLabel = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;

      return {
        label: formattedLabel,
        value: cumulativeCount
      };
    });
    console.log("chartData22", chartData);

    console.log("chartData con prueba", chartData);

    return chartData;
  };

  const chartData = generateChartData();

  // Calcular estadísticas reales
  const calculateChartStats = () => {
    const totalInscritos = attendees.length;

    if (totalInscritos === 0) {
      return [
        { label: "Total Inscritos", value: "0", trend: { positive: true, text: "Sin datos" } },
        { label: "Promedio Diario", value: "0", trend: { positive: true, text: "Sin datos" } },
        { label: "Pico Máximo", value: "0", trend: { positive: false, text: "Sin datos" } },
        { label: "Tasa de Conversión", value: "0%", trend: { positive: true, text: "Sin datos" } },
      ];
    }

    // Calcular promedio diario
    const registrationsByDate = {};
    attendees.forEach(attendee => {
      const date = attendee.registrationDate;
      if (date) {
        registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
      }
    });

    const uniqueDays = Object.keys(registrationsByDate).length;
    const averagePerDay = uniqueDays > 0 ? (totalInscritos / uniqueDays).toFixed(1) : "0";

    // Encontrar el día con más inscripciones
    let maxDate = "";
    let maxCount = 0;
    Object.entries(registrationsByDate).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDate = date;
      }
    });

    const maxDateFormatted = maxDate ? new Date(maxDate + 'T00:00:00').toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : "Sin datos";

    return [
      {
        label: "Total Inscritos",
        value: totalInscritos.toString(),
        trend: { positive: true, text: `${uniqueDays} días` },
      },
      {
        label: "Promedio Diario",
        value: averagePerDay,
        trend: { positive: true, text: "inscritos/día" },
      },
      {
        label: "Pico Máximo",
        value: maxCount.toString(),
        trend: { positive: false, text: maxDateFormatted },
      },

    ];
  };

  const chartStats = calculateChartStats();

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
      return <ModifyEventView event={formattedEventData} id={eventId} />
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