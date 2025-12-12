import { getEventRegisteredUser, getEventPendingUser, getEventCreatedUser, getEventConfirmedUser, finishEvent } from '../../api/api'
import { cancelAttendee } from '../../api/api'
import { getUser } from '../../api/api';
import toast from 'react-hot-toast';



function diaMes(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

function hora12Colombia(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota'
  }).toLowerCase();
}

const formattedDetailEvent = (event, onCloseHandler, showCancelar, showRegistrar, onBorrarHandler, onRegisterHandler) => {
  return {
    id: event.id, // IMPORTANTE: El ID es necesario para enviar la calificación
    titulo: event.title || "Sin título",
    descripcion: event.description || "Sin descripción",
    imag: event.images || [event.main_image || "https://via.placeholder.com/300x200"],
    fechaInicio: event.start_date || null,
    fechaFin: event.end_date || null,
    direccion: event.address || "Por definir",
    capacidad: event.capacity || 100,
    asistentes: event.attendees_count || 0,
    organizador: event.creator?.username || "Desconocido",
    categoria: event.category?.name || "Sin categoría",
    estado: event.status || "Activo",
    local_info: event.location_info || "Por definir",
    fechaCreacion: event.created_at || null,

    // NUEVO CAMPO: Pasamos la calificación al detalle (modal)
    myRating: event.my_rating || null,

    onClose: onCloseHandler,
    showBorrar: false,
    showCancelar: showCancelar,
    showRegistrar: showRegistrar,
    onCancelar: onBorrarHandler,  // Asignar la función al botón de cancelar
    onRegister: onRegisterHandler,

  };
};

export const getRegisteredEvents = async (closeModalHandler) => {
  try {
    const events = await getEventRegisteredUser();
    let userIdObtenido = null;

    try {
      const currentUser = await getUser();
      userIdObtenido = currentUser.id;
      console.log("ID del usuario actual:", userIdObtenido);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
    // Función para cancelar el registro del usuario en un evento
    const handleBorrarRegistro = async (userId, eventId) => {
      try {
        console.log("🚀 Cancelando registro - User ID:", userId, "Event ID:", eventId);
        const response = await cancelAttendee(eventId, userId);
        console.log("✅ Registro cancelado exitosamente:", response);

        // Mostrar toast de éxito
        toast.success("Registro cancelado exitosamente", {
          duration: 3000,
          style: {
            background: "var(--color-success)",
            color: "white",
          },
        });

        // Recargar la página después de un breve delay para que el usuario vea el toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("❌ Error al cancelar registro:", error);
        toast.error("Error al cancelar el registro", {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "white",
          },
        });
      }
    };

    // El endpoint devuelve EventAttendee (objeto con .event dentro)
    const formattedFromApi = events.data.map((item, index) => ({
      id: item.event.id || index,
      imageUrl: item.event.main_image || "https://via.placeholder.com/300x200",
      category: item.event.category?.name || "Sin categoría",
      title: item.event.title,
      description: item.event.description,
      date: diaMes(item.event.start_date) || "Por definir",
      time: hora12Colombia(item.event.start_date) || "Por definir",
      location: item.event.address || "Por definir",
      currentParticipants: item.event.attendees_count || 0,
      totalParticipants: item.event.capacity || 100,
      organizer: item.event.creator.username || "Desconocido",

      // CAMPOS CLAVE PARA EL HISTORIAL Y RATING:
      status: item.event.status,         // Para saber si es FINISHED
      myRating: item.event.my_rating,    // Objeto {score, comment} o null

      onRegisterClick: () => alert(`Ver detalle de registro ${item.event.id}`),
      onHeartClick: () => console.log(`Heart`),
      showRegisterButton: false,
      showHeartButton: false,
      readQRCode: true,
      formattedDetailEvent: formattedDetailEvent(
        events.event,
        closeModalHandler,
        true,
        false,
        () => handleBorrarRegistro(userIdObtenido, events.event.id),
        null
      )
    }));

    return formattedFromApi;

  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
};

export const getPendingEvents = async (closeModalHandler) => {
  try {
    // Llamada al backend
    const events = await getEventPendingUser();
    console.log(events)

    const formattedFromApi = events.data.map((events, index) => ({
      id: events.event.id || index,
      imageUrl: events.event.main_image || "https://via.placeholder.com/300x200",
      category: events.event.category?.name || "Sin categoría",
      title: events.event.title,
      description: events.event.description,
      date: diaMes(events.event.start_date) || "Por definir",
      time: hora12Colombia(events.event.start_date) || "Por definir",
      time: hora12Colombia(events.event.start_date) || "Por definir",
      location: events.event.address || "Por definir",
      currentParticipants: events.event.attendees_count || 0,
      totalParticipants: events.event.capacity || 100,
      organizer: events.event.creator.username || "Desconocido",
      onRegisterClick: () => alert(`Ver detalle de registro ${events.event.id}`),
      onHeartClick: () => console.log(`Heart ${hora12Colombia(events.event.start_date)}`),
      showRegisterButton: true,
      showHeartButton: true,
      activeHeart: true,
      formattedDetailEvent: formattedDetailEvent(events.event, closeModalHandler, false, true, null, null)

    }));


    return formattedFromApi


  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return []; // retornar array vacío en caso de error
  }
};

export const getCreatedEvent = async () => {
  try {
    // Llamada al backend
    const events = await getEventCreatedUser();

    const formattedFromApi = events.data.map((event, index) => ({
      id: event.id || index,
      imageUrl: event.main_image || "https://via.placeholder.com/300x200",
      category: event.category?.name || "Sin categoría",
      title: event.title,
      description: event.description,
      date: diaMes(event.start_date) || "Por definir",
      time: hora12Colombia(event.start_date) || "Por definir",
      location: event.address || "Por definir",
      currentParticipants: event.attendees_count || 0,
      totalParticipants: event.capacity || 100,
      organizer: event.creator.username || "Desconocido",
      status: event.status || "DRAFT", // Incluir el status del evento
      end_date: event.end_date || null, // Añadir fecha de finalización
      onRegisterClick: () => alert(`Ver detalle de registro ${event.id}`),
      onHeartClick: () => console.log(`Heart ${hora12Colombia(event.start_date)}`),
      showRegisterButton: false,
      showHeartButton: false,
      generateQRCode: true,
    }));


    return formattedFromApi


  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return []; // retornar array vacío en caso de error
  }
};

export const getConfirmedEvents = async (closeModalHandler) => {
  try {
    // Llamada al backend
    const events = await getEventConfirmedUser();

    const formattedFromApi = events.data.map((attendee, index) => ({
      id: attendee.event.id || index,
      imageUrl: attendee.event.main_image || "https://via.placeholder.com/300x200",
      category: attendee.event.category?.name || "Sin categoría",
      title: attendee.event.title,
      description: attendee.event.description,
      date: diaMes(attendee.event.start_date) || "Por definir",
      time: hora12Colombia(attendee.event.start_date) || "Por definir",
      location: attendee.event.address || "Por definir",
      currentParticipants: attendee.event.attendees_count || 0,
      totalParticipants: attendee.event.capacity || 100,
      organizer: attendee.event.creator?.username || "Desconocido",
      onRegisterClick: () => alert(`Ver detalle de registro ${attendee.event.id}`),
      onHeartClick: () => console.log(`Heart ${hora12Colombia(attendee.event.start_date)}`),
      showRegisterButton: false,
      showHeartButton: false,
      readQRCode: false,
      generateQRCode: false,
      formattedDetailEvent: formattedDetailEvent(attendee.event, closeModalHandler, false, true)
    }));

    return formattedFromApi;

  } catch (error) {
    console.error("Error al obtener eventos confirmados:", error);
    return []; // retornar array vacío en caso de error
  }
};

/**
 * Finaliza eventos activos cuya fecha de finalización ya pasó.
 * @param {Array} myEventsData - Array de eventos del usuario
 * @returns {Promise<number>} - Número de eventos finalizados
 */
export const finishExpiredEvents = async (myEventsData) => {
  try {
    const now = new Date();
    const activeEvents = myEventsData.filter(
      (event) => event.status === "ACTIVE"
    );

    // Filtrar eventos cuya fecha de finalización ya pasó
    const eventsToFinish = activeEvents.filter((event) => {
      if (!event.end_date) return false;
      const endDate = new Date(event.end_date);
      return endDate < now;
    });

    if (eventsToFinish.length === 0) {
      return 0;
    }

    // Finalizar todos los eventos que cumplen la condición
    const finishPromises = eventsToFinish.map((event) =>
      finishEvent(event.id).catch((error) => {
        console.error(`Error finalizando evento ${event.id}:`, error);
        return null;
      })
    );

    await Promise.all(finishPromises);

    return eventsToFinish.length;
  } catch (error) {
    console.error("Error al finalizar eventos:", error);
    throw error;
  }
};

