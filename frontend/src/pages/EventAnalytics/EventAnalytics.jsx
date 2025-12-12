import { Users, TrendingUp, MessageCircle } from "lucide-react";
import AnalyticsLayout from "../../components/Analytics/layout/AnalyticsLayout";
import EventAnalyticsHeader from "../../components/Analytics/headers/EventAnalyticsHeader";
import UserListView from "../../components/Analytics/views/UserListView";
import TimeSeriesChart from "../../components/Analytics/charts/TimeSeriesChart";
import CommentsListView from "../../components/Analytics/views/CommentsListView";
import { Pencil } from 'lucide-react';
import ModifyEventView from "../../components/Analytics/views/modifyEventView";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getEventById, getEventAttendees, getEventRatings } from '../../api/api';
import { Loader2 } from 'lucide-react';
import styles from './EventAnalytics.module.css';

const EventAnalytics = () => {
  const [activeView, setActiveView] = useState("users");
  const { eventId } = useParams();
  const [formattedEventData, setFormattedEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

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

          // Lógica de imágenes - Cargar como File objects para que EventForm las muestre
          const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
          // Remover /api/ del final si existe para obtener la URL base
          const API_BASE = BASE_URL.replace(/\/api\/?$/, '');
          const imagesArray = [];

          // Función helper para convertir URL relativa a absoluta
          const getFullImageUrl = (url) => {
            if (!url) return null;
            // Si ya es una URL completa (http/https), retornarla tal cual
            if (url.startsWith('http://') || url.startsWith('https://')) {
              return url;
            }
            // Si es una URL de Cloudinary, retornarla tal cual
            if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
              return url;
            }
            // Si es relativa, agregar la URL base del backend
            return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
          };

          // Función para cargar imagen como File object
          const loadImageAsFile = async (imageUrl) => {
            try {
              const fullUrl = getFullImageUrl(imageUrl);
              if (!fullUrl) return null;

              const response = await fetch(fullUrl);
              if (!response.ok) {
                console.error("Error al cargar imagen:", response.status);
                return { url: fullUrl, file: null };
              }

              const blob = await response.blob();
              const fileName = imageUrl.split('/').pop() || 'image.jpg';
              const file = new File([blob], fileName, { type: blob.type });
              
              return { 
                url: URL.createObjectURL(file), 
                file: file 
              };
            } catch (error) {
              console.error("Error al cargar imagen:", error);
              // Si falla, retornar solo la URL
              const fullUrl = getFullImageUrl(imageUrl);
              return { url: fullUrl, file: null };
            }
          };

          // Cargar imágenes existentes
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            // Si hay imágenes en el array, procesarlas
            const imagePromises = data.images.map(async (img) => {
              const imageUrl = img.image || img;
              return await loadImageAsFile(imageUrl);
            });
            
            const loadedImages = await Promise.all(imagePromises);
            formattedData.images = loadedImages.filter(img => img !== null);
          } else if (data.main_image) {
            // Si solo hay main_image, procesarla
            const loadedImage = await loadImageAsFile(data.main_image);
            if (loadedImage) {
              formattedData.images = [loadedImage];
            }
          }

          console.log("📌 Imágenes procesadas:", formattedData.images);
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
        setLoadingAttendees(true);
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
          console.log("formattedAttendees", formattedAttendees);
          setAttendees(formattedAttendees);
        } catch (error) {
          console.error("Error al obtener inscritos:", error);
          toast.error("No se pudo cargar la lista de inscritos");
          setAttendees([]);
        } finally {
          setLoadingAttendees(false);
        }
      }

      // B) Si la vista es COMENTARIOS
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
    attendees: loadingAttendees ? "Cargando..." : `${attendees.length} inscritos`,
    image: formattedEventData?.images?.[0]?.url,
  };

  const menuItems = [
    { id: "Modificar_evento", icon: <Pencil size={20} />, label: "Modificar evento" },
    { id: "users", icon: <Users size={20} />, label: "Lista de Inscritos" },
    { id: "registrations", icon: <TrendingUp size={20} />, label: "Inscripciones por Día" },
    { id: "comments", icon: <MessageCircle size={20} />, label: "Comentarios" }
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
    if (activeView === "comments") {
      return (
        <CommentsListView
          comments={comments}
          loading={loadingComments}
          styles={styles}
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
