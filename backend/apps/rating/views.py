from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status

from .models import Rating
from .serializers import RatingSerializer


class RatingViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las calificaciones (Ratings) de los eventos.

    
    Permite listar, crear, ver, actualizar y eliminar ratings.
    Solo el usuario que creó una calificación puede modificarla o eliminarla.
    Se asigna automáticamente el user desde el request (no se pasa por JSON).
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Si se pasa el parámetro ?event=<id>, filtra por ese evento.
        """
        queryset = super().get_queryset()
        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario autenticado como autor de la calificación.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Solo el autor puede actualizar su propia calificación.
        """
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("No puedes modificar una calificación de otro usuario.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Solo el autor puede eliminar su propia calificación.
        """
        if instance.user != self.request.user:
            raise PermissionDenied("No puedes eliminar una calificación de otro usuario.")
        instance.delete()