import React from 'react';
import EventDashboard from '../../UI/EventCreate/EventForm';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ModifyEventView = ({ event }) => {
    console.log("📌 Evento recibido en ModifyEventView:", event);

    const handleUpdate = (data) => {
        console.log("Datos actualizados:", data);
        toast.success("Evento actualizado exitosamente (Mock)");
    };

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
            console.log("Evento eliminado (Mock)");
            toast.success("Evento eliminado exitosamente (Mock)");
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
