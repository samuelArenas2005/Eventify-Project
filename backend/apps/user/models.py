from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.conf import settings

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


class User(AbstractUser):
    # Add related_name to avoid clash with auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    # Opciones para el campo rol
    ROL_CHOICES = [
        ('ESTUDIANTE', 'Estudiante'),
        ('PROFESOR', 'Profesor'),
        ('FUNCIONARIO', 'Funcionario'),
        ('EXTERNO', 'Externo'),
    ]

    # Deshabilitar campos no necesarios de AbstractUser
    first_name = None
    last_name = None
    
    # Validador para el nombre y apellido usando expresión regular
    nombre_apellido_validator = RegexValidator(
        regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$',
        message='Solo debe contener letras y espacios'
    )
    
    name = models.CharField(
        max_length=80, 
        validators=[nombre_apellido_validator],
        blank=False,
        null=False
    )
    
    last_name = models.CharField(
        max_length=80,
        validators=[nombre_apellido_validator],
        blank=False,
        null=False
    )
    
    # Campo rol
    rol = models.CharField(
        max_length=20,
        choices=ROL_CHOICES,
        default='EXTERNO',
        blank=False,
        null=False
    )
    
    # Validador para el teléfono
    telefono_validator = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message='El número de teléfono debe estar en formato: "+999999999". Se permiten de 9 a 15 dígitos.'
    )
    phone = models.CharField(
        validators=[telefono_validator],
        max_length=15,
        blank=True,
        null=True,
        unique=True,
        error_messages={
            'unique': ('Ya existe un usuario con este telefono.'),
        },
    )
    
    # Cambiar email a único y requerido
    email = models.EmailField(
        unique=True,
        error_messages={
            'unique': ('Ya existe un usuario con este correo electronico.'),
        },
    )
    
    # Usar ImageField o CloudinaryField para el avatar según el entorno
    avatar = get_image_field(
        upload_to='avatars/',
        blank=True,
        null=True
    )
    
    # Nuevo: validador para cédula (solo dígitos) y campo obligatorio
    cedula_validator = RegexValidator(
        regex=r'^\d+$',
        message='La cédula debe contener solo dígitos'
    )
    cedula = models.CharField(
        validators=[cedula_validator],
        max_length=25,
        unique=True,
        blank=False,
        null=False,
        error_messages={
            'unique': ('Ya existe un usuario con esta cédula.'),
        },
    )
    
    # Nuevo: código institucional (opcional, puede ser nulo)
    codigo_validator = RegexValidator(
        regex=r'^\d*$',
        message='El código institucional debe contener solo dígitos'
    )
    codigo = models.CharField(
        validators=[codigo_validator],
        max_length=20,
        blank=True,
        null=True,
    )
    
    is_admin = models.BooleanField(
        default=False,
        help_text='Designates whether this user has admin privileges.',
    )

    # Configuración de campos
    USERNAME_FIELD = 'email'
    # Añadimos 'cedula' a `createsuperuser` la solicite al crear usuarios
    REQUIRED_FIELDS = ['name', 'last_name', 'username', 'rol', 'cedula']
    
    def save(self, *args, **kwargs):
        if not self.pk:  
            self.is_admin = False  
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.name} {self.last_name}"
