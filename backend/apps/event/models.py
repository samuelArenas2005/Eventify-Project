from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.utils import timezone

class Category(models.Model):
    
    CATEGORY_CHOICES = [
        ('ACADEMICO', 'Academico'),
        ('DEPORTIVO', 'Deportivo'),
        ('SOCIAL', 'Social'),
        ('CULTURAL', 'Cultural'),
        ('TECNOLOGIA', 'Tecnologia')
    ]
    
    category = models.CharField(
        max_length=60,
        choices=CATEGORY_CHOICES,
        unique=True,
        blank=False,
        null=False
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category

class Event(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('CANCELLED', 'Cancelled'),
        ('FINISHED', 'Finished'),
        ('DRAFT', 'Draft')
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
    main_image = models.ImageField(
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
    
    categories = models.ManyToManyField(
        Category,
        related_name='events',
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
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled')
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
    image = models.ImageField(
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


