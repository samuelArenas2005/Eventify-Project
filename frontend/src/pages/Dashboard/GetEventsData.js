import {getEventRegisteredUser,getEventPendingUser,getEventCreatedUser} from '../../API/api'
 
 /* export const registeredEventsDataObjet = [


  {
    id: 1,
    imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Tecnología',
    title: 'Conferencia de Inteligencia Artificial',
    description: 'Aprende sobre las últimas tendencias en IA y Machine Learning.',
    date: '28 oct',
    time: '9:00 AM',
    location: 'Auditorio Principal',
    currentParticipants: 85,
    totalParticipants: 150,
    organizer: 'Google Devs',
    onRegisterClick: () => alert('Ver detalle de registro 1'),
    onHeartClick: () => console.log('Heart 1'),
  },
  {
    id: 2,
    imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Emprendimiento',
    title: 'Taller de Innovación y Startups',
    description: 'Aprende cómo convertir tus ideas en proyectos reales.',
    date: '05 nov',
    time: '2:00 PM',
    location: 'Sala de Conferencias B',
    currentParticipants: 40,
    totalParticipants: 50,
    organizer: 'Univalle Innovación',
    onRegisterClick: () => alert('Ver detalle de registro 2'),
    onHeartClick: () => console.log('Heart 2'),
  },
  {
    id: 3,
    imageUrl: 'https://images.pexels.com/photos/1181353/pexels-photo-1181353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Ciencia',
    title: 'Foro de Avances Científicos',
    description: 'Expertos internacionales discuten los últimos avances en biotecnología.',
    date: '10 nov',
    time: '10:30 AM',
    location: 'Centro de Convenciones',
    currentParticipants: 120,
    totalParticipants: 200,
    organizer: 'Ciencia Global',
    onRegisterClick: () => alert('Ver detalle de registro 3'),
    onHeartClick: () => console.log('Heart 3'),
  },
  {
    id: 4,
    imageUrl: 'https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Arte',
    title: 'Exposición de Arte Contemporáneo',
    description: 'Sumérgete en las obras de artistas emergentes locales.',
    date: '12 nov',
    time: '4:00 PM',
    location: 'Galería Univalle',
    currentParticipants: 65,
    totalParticipants: 100,
    organizer: 'ArteVivo',
    onRegisterClick: () => alert('Ver detalle de registro 4'),
    onHeartClick: () => console.log('Heart 4'),
  },
  {
    id: 5,
    imageUrl: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Educación',
    title: 'Seminario de Nuevas Metodologías Educativas',
    description: 'Conoce técnicas modernas para la enseñanza y el aprendizaje.',
    date: '15 nov',
    time: '8:30 AM',
    location: 'Sala Magna 2',
    currentParticipants: 70,
    totalParticipants: 120,
    organizer: 'Ministerio de Educación',
    onRegisterClick: () => alert('Ver detalle de registro 5'),
    onHeartClick: () => console.log('Heart 5'),
  },
  {
    id: 6,
    imageUrl: 'https://images.pexels.com/photos/3182766/pexels-photo-3182766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Salud',
    title: 'Jornada de Bienestar y Salud Mental',
    description: 'Participa en charlas sobre equilibrio emocional y autocuidado.',
    date: '18 nov',
    time: '3:00 PM',
    location: 'Auditorio Norte',
    currentParticipants: 55,
    totalParticipants: 80,
    organizer: 'Red de Psicología Univalle',
    onRegisterClick: () => alert('Ver detalle de registro 6'),
    onHeartClick: () => console.log('Heart 6'),
  },
  {
    id: 7,
    imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Medio Ambiente',
    title: 'Foro de Sostenibilidad y Energías Verdes',
    description: 'Analiza el impacto de las energías renovables en el desarrollo urbano.',
    date: '20 nov',
    time: '1:00 PM',
    location: 'Sala Verde',
    currentParticipants: 90,
    totalParticipants: 150,
    organizer: 'EcoFuture',
    onRegisterClick: () => alert('Ver detalle de registro 7'),
    onHeartClick: () => console.log('Heart 7'),
  },
  {
    id: 8,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Cultura',
    title: 'Festival Internacional de Cine Universitario',
    description: 'Disfruta de producciones audiovisuales creadas por estudiantes.',
    date: '25 nov',
    time: '6:00 PM',
    location: 'Teatro Central',
    currentParticipants: 110,
    totalParticipants: 200,
    organizer: 'CineUnivalle',
    onRegisterClick: () => alert('Ver detalle de registro 8'),
    onHeartClick: () => console.log('Heart 8'),
  },
  {
    id: 9,
    imageUrl: 'https://images.pexels.com/photos/3182836/pexels-photo-3182836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Deportes',
    title: 'Torneo Universitario de Fútbol',
    description: 'Competencia entre facultades en el estadio principal.',
    date: '28 nov',
    time: '10:00 AM',
    location: 'Cancha Norte',
    currentParticipants: 120,
    totalParticipants: 160,
    organizer: 'Liga Univalle',
    onRegisterClick: () => alert('Ver detalle de registro 9'),
    onHeartClick: () => console.log('Heart 9'),
  },
  {
    id: 10,
    imageUrl: 'https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Música',
    title: 'Concierto Sinfónico Universitario',
    description: 'La orquesta universitaria presenta un repertorio de música clásica y moderna.',
    date: '30 nov',
    time: '7:00 PM',
    location: 'Auditorio Beethoven',
    currentParticipants: 150,
    totalParticipants: 200,
    organizer: 'Orquesta Univalle',
    onRegisterClick: () => alert('Ver detalle de registro 10'),
    onHeartClick: () => console.log('Heart 10'),
  }
];  */

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

export const getRegisteredEvents = async () => {
  try {
    // Llamada al backend
    const events = await getEventRegisteredUser();

    const formattedFromApi = events.data.map((events, index) => ({
      id: events.event.id || index,
      imageUrl: events.event.main_image || "https://via.placeholder.com/300x200",
      category: events.event.category?.name || "Sin categoría",
      title: events.event.title,
      description: events.event.description,
      date: diaMes(events.event.start_date) || "Por definir",
      time: hora12Colombia(events.event.start_date)  || "Por definir",
      location: events.event.address || "Por definir",
      currentParticipants: events.event.attendees_count || 0,
      totalParticipants: events.event.capacity || 100,
      organizer: events.event.creator.username || "Desconocido",
      onRegisterClick: () => alert(`Ver detalle de registro ${events.event.id}`),
      onHeartClick: () => console.log(`Heart ${hora12Colombia(events.event.start_date)}`),
      showRegisterButton: false,
      showHeartButton: false,
    }));


    /* const map = new Map();
    registeredEventsDataObjet.forEach((e) => map.set(e.id, e));
    formattedFromApi.forEach((e) => map.set(e.id, e));
    return Array.from(map.values());  */
    return formattedFromApi


  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return []; // retornar array vacío en caso de error
  }
};

export const getPendingEvents = async () => {
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
      time: hora12Colombia(events.event.start_date)  || "Por definir",
      location: events.event.address || "Por definir",
      currentParticipants: events.event.attendees_count || 0,
      totalParticipants: events.event.capacity || 100,
      organizer: events.event.creator.username || "Desconocido",
      onRegisterClick: () => alert(`Ver detalle de registro ${events.event.id}`),
      onHeartClick: () => console.log(`Heart ${hora12Colombia(events.event.start_date)}`),
      showRegisterButton: true,
      showHeartButton: true,
      activeHeart: true,
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
      time: hora12Colombia(event.start_date)  || "Por definir",
      location: event.address || "Por definir",
      currentParticipants: event.attendees_count || 0,
      totalParticipants: event.capacity || 100,
      organizer: event.creator.username || "Desconocido",
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


