from django.shortcuts import render
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
        """Filter notifications to show only those belonging to the current user"""
        return UserNotification.objects.filter(user=self.request.user)

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

    def perform_create(self, serializer):
        """Ensure the user is set to the current user when creating"""
        serializer.save(user=self.request.user)
