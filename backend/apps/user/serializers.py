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
        validated_data.pop('password2')
        
        # Crear el User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            rol=validated_data['rol']
        )

        # Manejar el avatar si está presente
        if 'avatar' in validated_data:
            user.avatar = validated_data['avatar']
            user.save()

        return user