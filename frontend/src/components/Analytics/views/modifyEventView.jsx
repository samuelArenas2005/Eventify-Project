import React from 'react';
import EventDashboard from '../../UI/EventCreate/EventForm';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { updateEvent } from '../../../api/api';
import { cancelEvent } from '../../../api/api';

const ModifyEventView = ({ event, id }) => {
    console.log("📌 Evento recibido en ModifyEventView:", event);
    //aaa
    const handleUpdate = async (data) => {
        console.log("📝 Datos recibidos del formulario:", data);

        try {
            // Construir FormData para enviar al backend
            const formData = new FormData();

            // Campos básicos del evento (según models.py)
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("location_info", data.venueInfo || "");
            formData.append("capacity", String(data.capacity));

            // Fechas: combinar fecha y hora en formato ISO
            const startDateTime = `${data.startDate}T${data.startTime}:00`;
            const endDateTime = `${data.endDate}T${data.endTime}:00`;
            formData.append("start_date", startDateTime);
            formData.append("end_date", endDateTime);

            // Categoría (debe ser el ID de la categoría)
            formData.append("category", data.category);

            // Status - mantener el status actual del evento
            formData.append("status", event.status || "ACTIVE");

            // Manejar imágenes si hay nuevas
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                data.images.forEach((image, index) => {
                    // Solo agregar si es un archivo nuevo (File object)
                    if (image.file instanceof File) {
                        formData.append("images", image.file);
                        // Si es la imagen principal, agregarla también
                        if (index === data.mainImageIndex) {
                            formData.append("main_image", image.file);
                        }
                    }
                });
            }

            console.log("📦 Datos a enviar al backend:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
            }

            // Llamar a la API de actualización
            const response = await updateEvent(id, formData);

            console.log("✅ Respuesta del servidor:", response);
            toast.success("¡Evento actualizado exitosamente!");

        } catch (error) {
            console.error("❌ Error al actualizar evento:", error);
            const errorMessage = error?.response?.data?.detail
                || error?.response?.data?.message
                || error?.message
                || "Hubo un error al actualizar el evento";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas cancelar este evento?")) {
            try {
                const response = await cancelEvent(id);
                console.log("✅ Respuesta del servidor:", response);
                toast.success("¡Evento cancelado exitosamente!");
            } catch (error) {
                console.error("❌ Error al cancelar evento:", error);
                const errorMessage = error?.response?.data?.detail
                    || error?.response?.data?.message
                    || error?.message
                    || "Hubo un error al cancelar el evento";
                toast.error(errorMessage);
            }
        }
    };


    // Mostrar loading mientras se carga la información
    if (!event) {
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
                initialData={event}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onClose={() => console.log("Cerrar vista de modificación")}
            />
        </div>
    );
};

export default ModifyEventView;
