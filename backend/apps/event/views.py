# views.py
from django.db.models import Count, Prefetch
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import json
import base64
from openai import OpenAI
from dotenv import load_dotenv
import os

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
                 .select_related('creator', 'category')
                 .prefetch_related(
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

class ConfirmedAttendeesList(generics.ListAPIView):
    """
    /api/event/confirmed/  -> devuelve solo los EventAttendee confirmados del usuario autenticado
    """
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Ajusta el valor 'CONFIRMED' si en tu modelo usas constantes (e.g. EventAttendee.Status.CONFIRMED)
        return (
            EventAttendee.objects
            .select_related('user', 'event')
            .filter(user=user, status='CONFIRMED', event__status=Event.ACTIVE)
        )

class PendingAttendeesList(generics.ListAPIView):
    """
    /api/event/pending/  -> devuelve EventAttendee pendientes del usuario autenticado
    """
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            EventAttendee.objects
            .select_related('user', 'event')
            .filter(user=user, status='PENDING', event__status=Event.ACTIVE)
        )

class EventsByCreatorList(generics.ListAPIView):
    """
    /api/event/created/ -> eventos creados por el usuario autenticado
    """
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Event.objects.filter(creator=user).order_by('-start_date')
        return qs
    

class  ActiveEventsList(generics.ListAPIView):
    """
    /api/event/active/ -> eventos con status ACTIVE, permisos AllowAny,
    y si el usuario está autenticado excluye los eventos cuyo creador sea el mismo usuario.
    """
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        qs = (
            Event.objects
                 .filter(status=Event.ACTIVE)
                 .select_related('creator', 'category')
                 .prefetch_related(
                     'images',
                     Prefetch(
                         'eventattendee_set',
                         queryset=EventAttendee.objects.select_related('user')
                     )
                 )
                 .annotate(attendees_count=Count('attendees'))
                 .order_by('-start_date')
        )

        # Si el usuario está autenticado, excluimos los eventos que él creó
        if user and user.is_authenticated:
            qs = qs.exclude(creator=user)

        return qs

class AllRegisteredEventsList(generics.ListAPIView):
    """
    /api/event/registered/all/ -> devuelve todos los EventAttendee del usuario (activos y finalizados)
    """
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            EventAttendee.objects
            .select_related('user', 'event')
            .filter(user=user)
        )

class AllCreatedEventsList(generics.ListAPIView):
    """
    /api/event/created/all/ -> devuelve todos los eventos creados por el usuario (activos y finalizados)
    """
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(creator=user)

# ...existing code...


load_dotenv()
HARDCODED_API_KEY = os.getenv("OPENAI_API_KEY")

@csrf_exempt
def generate_image(request):
    """
    Versión MODIFICADA para prueba rápida con clave fija.
    """
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Method Not Allowed'}, status=405)

    try:
        payload = json.loads(request.body.decode('utf-8') or '{}')
        prompt = payload.get('prompt')
        if not prompt:
            return JsonResponse({'error': 'prompt required'}, status=400)

        client = OpenAI(api_key=HARDCODED_API_KEY)

        # ⚠️ Nota: El modelo 'gpt-image-1' no existe. 
        # Cámbialo a 'dall-e-2' o 'dall-e-3'. Usaré dall-e-2.
        resp = client.images.generate(
            model="dall-e-3", 
            prompt=prompt,
            n=1,
            size="1024x1024",
            response_format="b64_json"
        )

        b64 = resp.data[0].b64_json
        if not b64:
            return JsonResponse({'error': 'No image returned from provider'}, status=502)

        image_bytes = base64.b64decode(b64)
        return HttpResponse(image_bytes, content_type='image/png') 

    except Exception as e:
        # traceback.print_exc() # Descomentar para debug
        return JsonResponse({'error': str(e)}, status=500)
