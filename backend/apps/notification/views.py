from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Notification, UserNotification
from .serializers import NotificationSerializer, UserNotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class UserNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = UserNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter notifications to show only those belonging to the current user
        AND that are ready to be shown (visible_at <= now or null).
        También elimina notificaciones de eventos que ya terminaron.
        """
        now = timezone.now()
        
        # Obtener todas las notificaciones del usuario
        user_notifications = UserNotification.objects.filter(
            user=self.request.user
        ).filter(
            # Mostrar si visible_at es NULL (inmediata) O si ya pasó la fecha programada
            models.Q(notification__visible_at__isnull=True) | 
            models.Q(notification__visible_at__lte=now)
        ).select_related('notification', 'notification__event')
        
        # Identificar notificaciones de eventos que ya terminaron
        finished_event_notifications = user_notifications.filter(
            notification__event__isnull=False,
            notification__event__end_date__lt=now
        )
        
        # Eliminar las notificaciones de eventos terminados
        if finished_event_notifications.exists():
            # Obtener los IDs de las notificaciones principales para eliminarlas completamente
            finished_notification_ids = list(finished_event_notifications.values_list('notification_id', flat=True))
            
            # Eliminar las notificaciones principales (esto eliminará las UserNotifications en cascada)
            Notification.objects.filter(id__in=finished_notification_ids).delete()
            
            # Re-evaluar el queryset después de eliminar
            user_notifications = UserNotification.objects.filter(
                user=self.request.user
            ).filter(
                models.Q(notification__visible_at__isnull=True) | 
                models.Q(notification__visible_at__lte=now)
            ).select_related('notification', 'notification__event')
        
        # Retornar solo notificaciones de eventos activos o sin evento asociado
        return user_notifications.filter(
            models.Q(notification__event__isnull=True) |
            models.Q(notification__event__end_date__gte=now)
        ).order_by('-notification__sent_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Custom action to mark a notification as read"""
        notification = self.get_object()
        if notification.state != UserNotification.State.READ:
            notification.state = UserNotification.State.READ
            notification.read_at = timezone.now()
            notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=True, methods=['post'])
    def mark_as_delivered(self, request, pk=None):
        """Custom action to mark a notification as delivered"""
        notification = self.get_object()
        if notification.state != UserNotification.State.DELIVERED:
            notification.state = UserNotification.State.DELIVERED
            notification.delivered_at = timezone.now()
            notification.save()
        return Response({'status': 'notification marked as delivered'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marcar todas las notificaciones del usuario como leídas"""
        # Actualizamos todas las que no estén leídas
        self.get_queryset().exclude(state=UserNotification.State.READ).update(
            state=UserNotification.State.READ, 
            read_at=timezone.now()
        )
        return Response({'status': 'all marked as read'})

    def perform_create(self, serializer):
        """Ensure the user is set to the current user when creating"""
        serializer.save(user=self.request.user)
