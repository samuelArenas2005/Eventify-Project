from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.event.models import Event 

class Rating(models.Model):
    """
    A user's rating on an event.
    """
    event = models.ForeignKey(
        Event,                    
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # FK a tu modelo de usuario
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],  # 1–5
        help_text="Integer score from 1 to 5."
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) # equivalente a 'Fecha' en tu diagrama

    class Meta:
        db_table = 'rating'  # tabla en inglés
        verbose_name = 'Rating'
        verbose_name_plural = 'Ratings'
        constraints = [
            # Un usuario no puede calificar el mismo evento más de una vez
            models.UniqueConstraint(
                fields=['event', 'user'],
                name='unique_rating_per_user_event'
            )
        ]
        indexes = [
            models.Index(fields=['event']),
            models.Index(fields=['user']),
        ]

    def str(self):
        return f'Rating {self.score} by {self.user} on {self.event}'