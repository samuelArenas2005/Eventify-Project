from django.db import models
from django.conf import settings
from apps.event.models import Event 

class Notification(models.Model):
    """
    A notification associated to an event (e.g., reminders, updates).
    """
    class NotificationType(models.TextChoices):
        INFO = "INFO", "Info"
        REMINDER = "REMINDER", "Reminder"
        ALERT = "ALERT", "Alert"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    type = models.CharField(
        max_length=60,
        choices=NotificationType.choices,
        default=NotificationType.INFO,
    )
    sent_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Datetime when the notification was created/sent."
    )
    visible_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when this notification becomes visible/active. Used for scheduled reminders."
    )

    class Meta:
        indexes = [
            models.Index(fields=['event']),
            models.Index(fields=['type']),
            models.Index(fields=['-sent_at']),
            models.Index(fields=['visible_at']),
        ]

    def str(self) -> str:
        return f'Notification[{self.type}] for {self.event} at {self.sent_at:%Y-%m-%d %H:%M}'


class UserNotification(models.Model):
    
    class State(models.TextChoices):
        DELIVERED = "DELIVERED", "Delivered"
        READ = "READ", "Read"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_notifications'
    )
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='user_notifications'
    )
    
    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.DELIVERED
    )
    # Useful timestamps (optional but practical):
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'notification'],
                name='unique_user_notification'
            )
        ]
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['notification']),
            models.Index(fields=['state']),
        ]

    def str(self) -> str:
        return f'UserNotification(user={self.user}, state={self.state}, notif_id={self.notification_id})' 
