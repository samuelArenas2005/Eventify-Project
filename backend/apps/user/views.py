from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsAdminAttributeUser
from .models import User
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserUpdateSerializer,
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # por defecto para operaciones protegidas

    def get_permissions(self):
        # Permitir registro público (POST /users/)
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        # Usar serializer de registro al crear
        if self.action == 'create':
            return UserRegistrationSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Devuelve el usuario autenticado en /api/user/users/me/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """
        Actualiza la información del usuario autenticado en /api/user/users/update_me/
        Permite actualizar: password, email, username, name, last_name, phone, avatar, codigo
        """
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Devolver los datos actualizados con el serializer principal
            updated_serializer = UserSerializer(user)
            return Response(updated_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=['get'],
        url_path='analytics/daily-registrations',
        permission_classes=[permissions.IsAuthenticated, IsAdminAttributeUser],
    )
    def daily_registrations(self, request):
        """Devuelve conteos diarios de usuarios registrados en un rango de fechas."""
        start_param = request.query_params.get('start_date')
        end_param = request.query_params.get('end_date')

        if not start_param or not end_param:
            return Response(
                {'detail': 'start_date y end_date son obligatorios (ISO 8601).'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        start_dt = parse_datetime(start_param)
        end_dt = parse_datetime(end_param)
        if not start_dt or not end_dt:
            return Response(
                {'detail': 'Formato de fecha inválido. Usa ISO 8601 (e.g. 2024-11-01T00:00:00Z).'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tz = timezone.get_current_timezone()
        if timezone.is_naive(start_dt):
            start_dt = timezone.make_aware(start_dt, tz)
        if timezone.is_naive(end_dt):
            end_dt = timezone.make_aware(end_dt, tz)

        if end_dt < start_dt:
            return Response(
                {'detail': 'end_date debe ser mayor o igual a start_date.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        daily_counts = (
            User.objects
            .filter(date_joined__range=(start_dt, end_dt))
            .annotate(day=TruncDate('date_joined'))
            .values('day')
            .order_by('day')
            .annotate(count=Count('id'))
        )

        counts_map = {entry['day']: entry['count'] for entry in daily_counts}

        current_day = start_dt.date()
        end_day = end_dt.date()
        data = []
        total_period = 0
        while current_day <= end_day:
            count = counts_map.get(current_day, 0)
            total_period += count
            data.append({
                'label': current_day.strftime('%d %b'),
                'date': current_day.isoformat(),
                'value': count,
            })
            current_day += timedelta(days=1)

        return Response({
            'start_date': start_dt.isoformat(),
            'end_date': end_dt.isoformat(),
            'total_users_period': total_period,
            'series': data
        })

    @action(
        detail=False,
        methods=['get'],
        url_path='analytics/total-users',
        permission_classes=[permissions.IsAuthenticated, IsAdminAttributeUser],
    )
    def total_users(self, request):
        """Devuelve el conteo total de usuarios y usuarios activos."""
        total_users = User.objects.count()
        return Response({
            'total_users': total_users,
        })

    @action(
        detail=False,
        methods=['post'],
        url_path='admin/promote-by-cedula',
        permission_classes=[permissions.IsAuthenticated],
    )
    def promote_admin(self, request):
        """Asigna is_admin=True al usuario cuyo número de cédula se envíe."""
        if not getattr(request.user, 'is_admin', False):
            return Response(
                {'detail': 'Solo los administradores pueden realizar esta acción.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        cedula = request.data.get('cedula')
        if not cedula:
            return Response(
                {'detail': 'El campo "cedula" es obligatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = get_object_or_404(User, cedula=cedula)
        if not usuario.is_admin:
            usuario.is_admin = True
            usuario.save(update_fields=['is_admin'])

        serializer = UserSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['post'],
        url_path='admin/remove-by-cedula',
        permission_classes=[permissions.IsAuthenticated],
    )
    def remove_admin(self, request):
        """Desactiva is_admin para el usuario con la cédula indicada."""
        if not getattr(request.user, 'is_admin', False):
            return Response(
                {'detail': 'Solo los administradores pueden realizar esta acción.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        cedula = request.data.get('cedula')
        if not cedula:
            return Response(
                {'detail': 'El campo "cedula" es obligatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = get_object_or_404(User, cedula=cedula)
        if usuario.is_admin:
            usuario.is_admin = False
            usuario.save(update_fields=['is_admin'])

        serializer = UserSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['get'],
        url_path='lookup/by-cedula',
        permission_classes=[permissions.IsAuthenticated],
    )
    def lookup_by_cedula(self, request):
        """Devuelve los datos del usuario asociado a la cédula solicitada."""
        if not getattr(request.user, 'is_admin', False):
            return Response(
                {'detail': 'Solo los administradores pueden consultar por cédula.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        cedula = request.query_params.get('cedula')
        if not cedula:
            return Response(
                {'detail': 'Debe proporcionar el parámetro "cedula".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = get_object_or_404(User, cedula=cedula)
        serializer = UserSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)



