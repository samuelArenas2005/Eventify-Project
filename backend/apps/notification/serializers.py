from rest_framework import serializers
from .models import Notification, UserNotification
from apps.event.serializers import EventListSerializer 

class NotificationSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)  
    event_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Notification
        fields = (
            'id',
            'event',
            'event_id',
            'message',
            'type',
            'sent_at'
        )
        read_only_fields = ('sent_at',)

class UserNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)
    notification_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserNotification
        fields = (
            'id',
            'user',
            'notification',
            'notification_id',
            'state',
            'delivered_at',
            'read_at'
        )
        read_only_fields = ('delivered_at', 'read_at')