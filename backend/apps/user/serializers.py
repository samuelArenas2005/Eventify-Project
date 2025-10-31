from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para operaciones CRUD generales del User
    """
    class Meta:
        model = User
        fields = (
            'id', 
            'username',
            'email', 
            'name', 
            'last_name',
            'phone',
            'rol',
            'avatar',
            'codigo',
            'cedula',
            'is_active',
            'is_admin'
        )
        read_only_fields = ('id', 'is_active','is_admin')


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de Users con validación de contraseña
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'password2',
            'name',
            'last_name',
            'phone',
            'rol',
            'codigo',
            'cedula',
            'avatar'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Las contraseñas no coinciden"
            })
        return attrs

    def create(self, validated_data):
        # Remover password2 del diccionario
        validated_data.pop('password2', None)
        
        # campos que faltaban para create user 
        phone = validated_data.pop('phone', '') or ''
        codigo = validated_data.pop('codigo', None)
        cedula = validated_data.pop('cedula', None)

        # Crear el User (asegura que se pasan los campos requeridos)
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            name=validated_data.get('name'),
            last_name=validated_data.get('last_name'),
            phone=phone,
            rol=validated_data.get('rol'),
            cedula=cedula,
            codigo=codigo
        )

        # Manejar el avatar si está presente
        avatar = validated_data.get('avatar')
        if avatar:
            user.avatar = avatar
            user.save()

        return user