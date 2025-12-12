from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.utils import timezone

# Importar CloudinaryField condicionalmente
try:
    from cloudinary_storage.storage import MediaCloudinaryStorage
    from cloudinary.models import CloudinaryField
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False
    CloudinaryField = None

def get_image_field(upload_to, **kwargs):
    """
    Retorna CloudinaryField si no está en DEBUG y Cloudinary está disponible,
    de lo contrario retorna ImageField normal.
    """
    if not settings.DEBUG and CLOUDINARY_AVAILABLE and CloudinaryField:
        return CloudinaryField(upload_to=upload_to, **kwargs)
    else:
        return models.ImageField(upload_to=upload_to, **kwargs)

class Category(models.Model):
    name = models.CharField(
        max_length=60,
        unique=True,
        blank=False,
        null=False
    )
    color = models.CharField(
        max_length=7,  # Para formato hexadecimal #RRGGBB
        default='#000000',
        blank=False,
        null=False,
        help_text='Color en formato hexadecimal (ej: #FF5733)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Event(models.Model):
    ACTIVE = 'ACTIVE'
    CANCELLED = 'CANCELLED'
    FINISHED = 'FINISHED'
    DRAFT = 'DRAFT'

    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (CANCELLED, 'Cancelled'),
        (FINISHED, 'Finished'),
        (DRAFT, 'Draft')
    ]

    title = models.CharField(
        max_length=60,
        blank=False,
        null=False,
        db_index=True
    )
    
    description = models.TextField(
        blank=False,
        null=False
    )
    main_image = get_image_field(
        upload_to='events/',
        blank=True,
        null=True
    )
    start_date = models.DateTimeField(
        blank=False,
        null=False,
        validators=[MinValueValidator(limit_value=timezone.now)]
    )
    end_date = models.DateTimeField(
        blank=False,
        null=False
    )
    address = models.CharField(
        max_length=60,
        blank=False,
        null=False
    )
    location_info = models.TextField(
        blank=True,
        null=True
    )
    capacity = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=False,
        null=False
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        blank=False,
        null=False
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='created_events',
        null=True,
        db_index=True
    )
    attendees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='EventAttendee',
        related_name='attending_events'
    )
    
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='events',
        null=True,
        blank=False
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_date__gt=models.F('start_date')),
                name='end_date_after_start_date'
            ),
            models.CheckConstraint(
                check=models.Q(capacity__gt=0),
                name='capacity_positive'
            )
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_date and self.start_date < timezone.now():
            raise ValidationError('Start date cannot be in the past')
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError('End date must be after start date')

    def __str__(self):
        return self.title

class EventAttendee(models.Model):
    STATUS_CHOICES = [
        ('REGISTERED', 'Registered'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('FAVORITE', 'Favorite'),
        ('PENDING','Pending')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'event']
        indexes = [
            models.Index(fields=['user', 'event']),
            models.Index(fields=['status'])
        ]

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

class EventImage(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = get_image_field(
        upload_to='events/images/',
        blank=False,
        null=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Event Image'
        verbose_name_plural = 'Event Images'

    def __str__(self):
        return f"Image for event: {self.event.title}"


