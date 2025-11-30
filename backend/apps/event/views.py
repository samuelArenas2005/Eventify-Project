# views.py
from django.db.models import Count, Prefetch
from django.db.models.functions import TruncDate
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
import json
import base64
from openai import OpenAI
from dotenv import load_dotenv
import os

from datetime import timedelta
from apps.notification.models import Notification, UserNotification
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
        event = serializer.save(creator=self.request.user)

        # --- Lógica de Notificación ---
        # Crear recordatorio programado para 1 día antes
        reminder_date = event.start_date - timedelta(days=1)
        
        notification = Notification.objects.create(
            event=event,
            type=Notification.NotificationType.REMINDER,
            message=f"¡Recordatorio! Tu evento '{event.title}' es mañana a las {event.start_date.strftime('%H:%M')}.",
            visible_at=reminder_date
        )

        # Suscribir al creador al recordatorio
        UserNotification.objects.create(
            user=event.creator,
            notification=notification,
            state=UserNotification.State.DELIVERED
        )

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
            # Buscar si ya existe una notificación de recordatorio para este evento
            reminder_notif = Notification.objects.filter(
                event=event, 
                type=Notification.NotificationType.REMINDER
            ).first()
            
            if reminder_notif:
                # Suscribir al usuario a esa notificación existente
                UserNotification.objects.get_or_create(
                    user=request.user,
                    notification=reminder_notif
                )
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

    @action(detail=True, methods=['put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def confirm_attendance(self, request, pk=None):
        """
        Actualiza el status del EventAttendee del usuario autenticado a 'CONFIRMED'.
        Recibe el nuevo status en el body (opcional, por defecto 'CONFIRMED').
        """
        event = self.get_object()
        user = request.user
        new_status = request.data.get('status', 'CONFIRMED')
        
        # Validar que el status sea válido
        valid_statuses = [choice[0] for choice in EventAttendee.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'detail': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            attendee = EventAttendee.objects.get(event=event, user=user)
            attendee.status = new_status
            attendee.save()
            serializer = EventAttendeeSerializer(attendee, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EventAttendee.DoesNotExist:
            return Response(
                {'detail': 'You are not registered to this event'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def attendees(self, request, pk=None):
        """
        GET /api/event/events/{pk}/attendees/ -> lista de usuarios inscritos al evento {pk}, osea a la id
        """
        event = self.get_object()
        qs = (
            EventAttendee.objects
            .select_related('user')
            .filter(event=event)
        )
        serializer = EventAttendeeSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


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
            .filter(user=user, status='REGISTERED', event__status=Event.ACTIVE)
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
            .filter(user=user, status='FAVORITE', event__status=Event.ACTIVE)
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
            .filter(user=user, status='CONFIRMED', event__status=Event.ACTIVE or Event.FINISHED)
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


class PopularUpcomingEventsView(generics.ListAPIView):
    """Retorna los eventos próximos con mayor número de inscritos."""
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        now = timezone.now()
        try:
            limit = int(self.request.query_params.get('limit', 5))
        except (TypeError, ValueError):
            limit = 5

        limit = max(1, min(limit, 10))

        return (
            Event.objects
            .filter(start_date__gte=now, status=Event.ACTIVE)
            .select_related('creator', 'category')
            .prefetch_related('images')
            .annotate(popular_attendees=Count('attendees', distinct=True))
            .order_by('-popular_attendees', 'start_date')[:limit]
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        results = serializer.data
        payload = {
            'results': results,
            'count': len(results),
        }

        if not results:
            payload['message'] = 'No hay eventos populares próximos disponibles.'

        return Response(payload)


class EventDailyCreatedCountView(APIView):
    """Devuelve conteos diarios de eventos creados entre dos fechas para Analytics."""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        start_param = request.query_params.get('start_date')
        end_param = request.query_params.get('end_date')

        if not start_param or not end_param:
            raise ValidationError({'detail': 'start_date y end_date son obligatorios (ISO 8601).'})

        start_dt = parse_datetime(start_param)
        end_dt = parse_datetime(end_param)
        if not start_dt or not end_dt:
            raise ValidationError({'detail': 'Formato de fecha inválido. Usa ISO 8601, ej: 2024-11-01T00:00:00Z.'})

        tz = timezone.get_current_timezone()
        if timezone.is_naive(start_dt):
            start_dt = timezone.make_aware(start_dt, tz)
        if timezone.is_naive(end_dt):
            end_dt = timezone.make_aware(end_dt, tz)

        if end_dt < start_dt:
            raise ValidationError({'detail': 'end_date debe ser mayor o igual a start_date.'})

        daily_counts = (
            Event.objects
            .filter(created_at__range=(start_dt, end_dt))
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .order_by('day')
            .annotate(count=Count('id'))
        )

        counts_map = {entry['day']: entry['count'] for entry in daily_counts}

        current_day = start_dt.date()
        end_day = end_dt.date()
        data = []
        total = 0
        while current_day <= end_day:
            count = counts_map.get(current_day, 0)
            total += count
            data.append({
                'label': current_day.strftime('%d %b'),
                'date': current_day.isoformat(),
                'value': count,
            })
            current_day += timedelta(days=1)

        now = timezone.now()

        finished_period_end = end_dt if end_dt <= now else now

        finished_events_qs = (
            Event.objects
            .filter(
                end_date__gte=start_dt,
                end_date__lte=finished_period_end
            )
            .select_related('category', 'creator')
        )

        finished_events = [
            {
                'id': event.id,
                'title': event.title,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'category': event.category.name if event.category else None,
                'creator_id': event.creator_id,
            }
            for event in finished_events_qs
        ]

        ongoing_events_total = (
            Event.objects
            .exclude(status=Event.CANCELLED)
            .filter(end_date__gte=now)
            .count()
        )

        return Response({
            'start_date': start_dt.isoformat(),
            'end_date': end_dt.isoformat(),
            'total_events': total,
            'series': data,
            'finished_events_count': len(finished_events),
            'ongoing_events_total': ongoing_events_total,
        })

class ConfirmEventRegistrationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        
        # Verificar si el usuario ya está inscrito
        existing_attendee = EventAttendee.objects.filter(
            event=event,
            user=request.user
        ).first()
        
        if existing_attendee:
            return Response(
                {"detail": "Ya estás inscrito en este evento."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear nueva inscripción
        attendee = EventAttendee.objects.create(
            event=event,
            user=request.user,
            status='REGISTERED'
        )

        # Buscar si ya existe una notificación de recordatorio para este evento
        reminder_notif = Notification.objects.filter(
            event=event, 
            type=Notification.NotificationType.REMINDER
        ).first()
        
        if reminder_notif:
            # Suscribir al usuario a esa notificación existente
            UserNotification.objects.get_or_create(
                user=request.user,
                notification=reminder_notif
            )
        
        serializer = EventAttendeeSerializer(attendee, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

        # 💡 CAMBIO CLAVE: Pasa la clave directamente al constructor de OpenAI
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
