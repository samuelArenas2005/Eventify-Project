# views.py
from django.db.models import Count, Prefetch
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event, Category, EventAttendee, EventImage
from .serializers import (
    CategorySerializer,
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    EventAttendeeSerializer,
    EventImageSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD sencillo para categorias. Permisos: cualquiera puede ver,
    solo usuarios autenticados pueden crear/editar/borrar.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Event:
    - list -> EventListSerializer
    - retrieve -> EventDetailSerializer
    - create/update -> EventCreateUpdateSerializer
    - acciones custom: POST /events/{pk}/attend/ y POST /events/{pk}/unattend/
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return (
            Event.objects
                 .select_related('creator')
                 .prefetch_related(
                     'categories',
                     'images',  # Add prefetch for images
                     Prefetch(
                         'eventattendee_set',
                         queryset=EventAttendee.objects.select_related('user')
                     )
                 )
                 .annotate(attendees_count=Count('attendees'))
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventListSerializer

    def perform_create(self, serializer):
        # Guardar el creator (cadena simple, util en ejercicios)
        # Si tu serializer ya intenta asignarlo desde context, esto no hará daño.
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, pk=None):
        """
        Registrar al usuario autenticado como asistente del evento.
        Si ya existe, devolvemos 200 con el objeto; si se crea, 201.
        """
        event = self.get_object()
        attendee, created = EventAttendee.objects.get_or_create(event=event, user=request.user)
        serializer = EventAttendeeSerializer(attendee, context={'request': request})
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unattend(self, request, pk=None):
        """
        Elimina la participación del usuario en el evento.
        """
        event = self.get_object()
        try:
            attendee = EventAttendee.objects.get(event=event, user=request.user)
            attendee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EventAttendee.DoesNotExist:
            return Response({'detail': 'Not attending'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def add_images(self, request, pk=None):
        """Add multiple images to an event"""
        event = self.get_object()
        images = request.FILES.getlist('images')
        
        created_images = []
        for image in images:
            event_image = EventImage.objects.create(
                event=event,
                image=image
            )
            created_images.append(event_image)

        serializer = EventImageSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def remove_image(self, request, pk=None):
        """Remove a specific image from an event"""
        try:
            image_id = request.data.get('image_id')
            image = EventImage.objects.get(
                id=image_id,
                event_id=pk
            )
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EventImage.DoesNotExist:
            return Response(
                {'detail': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class EventAttendeeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Listado/Detalle de attendees. (Lectura únicamente en este ejemplo).
    """
    queryset = EventAttendee.objects.select_related('user', 'event').all()
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ConfirmedAttendeesByUserList(generics.ListAPIView):
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]  # para pruebas

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return EventAttendee.objects.none()

        return (
            EventAttendee.objects
            .select_related('user', 'event')
            .filter(
                user__id=user_id,
                status='CONFIRMED',
                event__status=Event.ACTIVE  # usa Event.ACTIVE o 'ACTIVE'
            )
        )

class PendingAttendeesByUserList(generics.ListAPIView):
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]  # para pruebas

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return EventAttendee.objects.none()

        return (
            EventAttendee.objects
            .select_related('user', 'event')
            .filter(
                user__id=user_id,
                status='PENDING',
                event__status=Event.ACTIVE  # usa Event.ACTIVE o 'ACTIVE'
            )
        )
        
class EventsByCreatorList(generics.ListAPIView):
    """
    Lista eventos creados por un usuario dado (creator = user).
    URL ejemplo: /api/events/by-creator/3/
    """
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated]  # Cambia a IsAuthenticated si lo necesitas

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return Event.objects.none()

        qs = Event.objects.filter(creator__id=user_id).order_by('-start_date')
        #qs = qs.select_related('creator').prefetch_related('categories', 'images')
        return qs