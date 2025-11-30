import React, { useState, useEffect } from 'react';
import EventDashboard from '../../UI/EventCreate/EventForm';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../../api/api';
import { Loader2 } from 'lucide-react';

const ModifyEventView = () => {
    const [eventData, setEventData] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEventData = async () => {
            if (!eventId) return;

            try {
                const data = await getEventById(eventId);
                if (data) {
                    // Mapear los datos de la API al formato del formulario
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
                        category: data.category.id,
                        images: []
                    };
                    console.log("📌 Tu puto Event es 1:", data);
                    console.log("📌 Tu puto Event es 2:", formattedData);

                    // Manejar imágenes existentes
                    if (data.images && Array.isArray(data.images)) {
                        const imagePromises = data.images.map(async (imgUrl) => {
                            try {
                                const url = typeof imgUrl === 'string' ? imgUrl : imgUrl.image;
                                const response = await fetch(url);
                                const blob = await response.blob();
                                const filename = url.split('/').pop() || 'image.jpg';
                                const file = new File([blob], filename, { type: blob.type });

                                return { url: URL.createObjectURL(file), file: file };
                            } catch (err) {
                                console.error("Error cargando imagen existente:", err);
                                return null;
                            }
                        });

                        const processedImages = await Promise.all(imagePromises);
                        formattedData.images = processedImages.filter(img => img !== null);
                    } else if (data.main_image) {
                        try {
                            const response = await fetch(data.main_image);
                            const blob = await response.blob();
                            const file = new File([blob], 'main_image.jpg', { type: blob.type });
                            formattedData.images = [{ url: URL.createObjectURL(file), file: file }];
                        } catch (err) {
                            console.error("Error cargando main_image:", err);
                        }
                    }

                    setEventData(formattedData);
                }
            } catch (error) {
                console.error("Error al obtener el evento:", error);
                toast.error("No se pudo cargar la información del evento");
            }
        };

        fetchEventData();
    }, [eventId]);

    const handleUpdate = (data) => {
        console.log("Datos actualizados (Mock):", data);
        toast.success("Evento actualizado exitosamente (Mock)");
    };

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
            console.log("Evento eliminado (Mock)");
            toast.success("Evento eliminado exitosamente (Mock)");
        }
    };

    // Mostrar loading mientras se carga la información
    if (!eventData) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <EventDashboard
                isEditMode={true}
                initialData={eventData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onClose={() => console.log("Cerrar vista de modificación")}
            />
        </div>
    );
};

export default ModifyEventView;
