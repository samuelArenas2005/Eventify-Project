from django.contrib import admin
from .models import Notification, UserNotification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'type', 'message', 'visible_at', 'sent_at')
    list_filter = ('type', 'visible_at', 'sent_at')
    search_fields = ('message', 'event__title')
    ordering = ('-sent_at',)

@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'notification', 'state', 'delivered_at', 'read_at')
    list_filter = ('state', 'read_at')
    search_fields = ('user__email', 'notification__message')
    ordering = ('-notification__sent_at',)
