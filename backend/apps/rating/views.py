from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Rating
from .serializers import RatingSerializer
from apps.event.models import EventAttendee, Event
from django.utils import timezone # Asegúrate de tener esto importado

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.validated_data['event']

        # 1. Validar inscripción
        has_attended = EventAttendee.objects.filter(
            user=user, 
            event=event, 
            status__in=['CONFIRMED', 'REGISTERED'] 
        ).exists()

        if not has_attended:
            raise ValidationError("No puedes calificar un evento al que no estás inscrito.")

        # 2. VALIDACIÓN DE FECHA (Lógica solicitada)
        # Si el evento tiene fecha de fin y esa fecha es FUTURA (mayor a ahora), bloqueamos.
        if event.end_date and event.end_date > timezone.now():
             raise ValidationError("El evento aún no ha finalizado, por lo tanto no puedes calificarlo todavía.")

        serializer.save(user=user)


    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("No puedes modificar una calificación de otro usuario.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("No puedes eliminar una calificación de otro usuario.")
        instance.delete()