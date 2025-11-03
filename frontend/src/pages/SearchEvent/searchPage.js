import { getAllEvents } from '../../API/api'


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

const formattedDetailEvent = (event, onCloseHandler) => {
  return {

    titulo: event.title || "Sin título",
    descripcion: event.description || "Sin descripción",
    imag: event.images || [event.main_image || "https://via.placeholder.com/300x200"],
    fechaInicio: event.start_date || null,
    fechaFin: event.end_date || null,
    direccion: event.location_info || "Por definir",
    capacidad: event.capacity || 100,
    asistentes: event.attendees_count || 0,
    organizador: event.creator?.username || "Desconocido",
    categoria: event.categories?.[0]?.category || "Sin categoría",
    estado: event.status || "Activo",
    local_info: event.location_info || "Por definir",   // detalle del local
    fechaCreacion:event.created_at || null,     // string ISO o similar

    onClose: onCloseHandler,
    showEditar: true,
    onEditar: () => console.log(`Editar evento ${event.id}`),
    showBorrar: true,
    onBorrar: () => console.log(`Borrar evento ${event.id}`),
    showRegistrar: false,
    onRegistrar: () => console.log(`Registrar en evento ${event.id}`)
  };
};

const showDetailedEvent = (event) => {


}

export const getEvents = async (closeModalHandler) => {
  try {
    const response = await getAllEvents();
    console.log("Respuesta cruda del backend:", response);

    const events = Array.isArray(response) ? response : [];

    const formattedFromApi = events.map(event => ({
      id: event.id || 0,
      imageUrl: event.main_image || "https://via.placeholder.com/300x200",
      category: event.categories?.[0]?.category || "Sin categoría",
      title: event.title || "Sin título",
      description: event.description || "Sin descripción",
      date: event.start_date ? diaMes(event.start_date) : "Por definir",
      time: event.start_date ? hora12Colombia(event.start_date) : "Por definir",
      location: event.location_info || "Por definir",
      currentParticipants: event.attendees_count || 0,
      totalParticipants: event.capacity || 100,
      organizer: event.creator?.username || "Desconocido",
      onRegisterClick: () => alert(`Ver detalle de registro ${event.id}`),
      onHeartClick: () => console.log(`Heart ${event.start_date}`),
      showRegisterButton: true,
      showHeartButton: true,
      activeHeart: false,
      formattedDetailEvent: formattedDetailEvent(event, closeModalHandler) // Pass the close handler
    }));

    console.log("Eventos formateados:", formattedFromApi);
    return formattedFromApi;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
};