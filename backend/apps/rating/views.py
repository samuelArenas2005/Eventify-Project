from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Rating
from .serializers import RatingSerializer
from apps.event.models import EventAttendee, Event # Importamos los modelos necesarios
from django.utils import timezone

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated] # Cambiado a IsAuthenticated para obligar login

    def get_queryset(self):
        queryset = super().get_queryset()
        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.validated_data['event']

        # 1. Validar que el usuario está inscrito y confirmado en el evento
        # Ajusta los estados según tu lógica (REGISTERED o CONFIRMED)
        has_attended = EventAttendee.objects.filter(
            user=user, 
            event=event, 
            status__in=['CONFIRMED', 'REGISTERED'] 
        ).exists()

        if not has_attended:
            raise ValidationError("No puedes calificar un evento al que no estás inscrito.")

        # 2. (Opcional) Validar que el evento ya terminó o está activo
        # Si solo quieres calificaciones post-evento, descomenta esto:
        # if event.end_date > timezone.now():
        #     raise ValidationError("El evento aún no ha terminado, no puedes calificarlo.")

        serializer.save(user=user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("No puedes modificar una calificación de otro usuario.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("No puedes eliminar una calificación de otro usuario.")
        instance.delete()